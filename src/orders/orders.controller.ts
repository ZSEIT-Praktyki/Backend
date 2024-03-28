import {
  BadRequestException,
  Body,
  Controller,
  Headers,
  NotFoundException,
  Post,
  Get,
  Req,
  UseGuards,
  Res,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import User from 'src/decorators/User.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ListingsService } from 'src/listings/services/listings.service';
import { ManagmentService } from 'src/listings/services/managment.service';
import { UserService } from 'src/user/user.service';
import { AddressDto } from './dto/orders.dto';
import { BufferRequest } from './orders.interface';
import { OrdersService } from './orders.service';
import { Response } from 'express';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private listingService: ListingsService,
    private managmentService: ManagmentService,
    private userService: UserService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/history')
  getPurchaseHistory(@User() id: number) {
    return this.ordersService.getPurchaseHistory(id);
  }

  @Get('/states')
  getStates() {
    return this.ordersService.getStates();
  }

  @UseGuards(AuthGuard)
  @Post('/address')
  async postAddress(@Body() props: AddressDto, @User() user_id: number) {
    try {
      const result = await this.ordersService.setUserAddress({ ...props, user_id });

      if (result.raw.affectedRows > 0) {
        return {
          statusCode: 201,
          message: 'created',
        };
      }
      throw new BadRequestException();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  @Get('/address')
  @UseGuards(AuthGuard)
  getAddresses(@User() id: number) {
    return this.ordersService.getRelatedAddresses(id);
  }

  @Get('/sold')
  @UseGuards(AuthGuard)
  getSold(@User() id: number) {
    return this.ordersService.getSaledProducts(id);
  }

  @Get('/order/:orderId')
  @UseGuards(AuthGuard)
  getOrderDetails(@User() id: number, @Param('orderId') orderId: number) {
    return this.ordersService.getOrderById(orderId);
  }

  @UseGuards(AuthGuard)
  @Post('/create-intent')
  async createPaymentIntent(
    @Body('listing_id') listing_id: number,
    @Body('address_id') address_id: number,
    @User() user_id: number,
  ) {
    try {
      const { price } = await this.listingService.getById(listing_id);

      const order = await this.ordersService.createOrder({
        address_id: +address_id,
        listing_id: +listing_id,
        buyer_id: +user_id,
        payment_intent_id: '',
        quantity: 1,
        total: price,
      });

      if (order.raw.affectedRows === 0) throw new BadRequestException('Order not created');

      const orderId = order.generatedMaps[0].order_id;
      const paymentIntent = await this.ordersService.createPaymentIntent(price, orderId);

      return {
        statusCode: 200,
        paymentIntent: paymentIntent.client_secret,
        orderId,
      };
    } catch (error) {
      throw new NotFoundException(`Product with id: ${listing_id} doesnt exist`);
    }
  }

  @Post('/webhook')
  async hanldeIncomingEvent(
    @Headers('stripe-signature') signature: string,
    @Req() request: BufferRequest,
    @Res() res: Response,
  ) {
    if (!signature) throw new BadRequestException('Missing stripe-signature header');

    try {
      const event = await this.ordersService.constructEventFromPayload(signature, request.rawBody);

      switch (event.type) {
        case 'payment_intent.succeeded':
          // @ts-ignore
          const { orderId } = event.data.object.charges.data[0].metadata;

          const order = await this.ordersService.getOrderById(+orderId);

          try {
            await this.ordersService.completeOrder(+orderId, {
              status: 1,
              payment_intent_id: (event.data.object as any).id,
            });

            const listingId = order.listing_id.listing_id;

            await this.managmentService.decrementAmmount(listingId as any);
            const { price, seller_id } = await this.managmentService.getListingCredentials(listingId as any);
            await this.userService.addIncome(seller_id as any, price);

            res.status(200).send('ok');
          } catch (error) {
            console.warn(error);
          }

          break;

        case 'payment_intent.payment_failed':
          // @ts-ignore
          const { order_id } = event.data.object.charges.data[0].metadata;

          await this.ordersService.failOrder(+order_id, (event.data.object as any).id);

          res.status(200).send('ok');
          break;

        default:
          console.warn(`Unhandled event type: ${event.type}`);
      }

      return {};
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
