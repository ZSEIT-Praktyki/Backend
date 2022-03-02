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
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import User from 'src/decorators/User.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { ListingsService } from 'src/listings/services/listings.service';
import { ManagmentService } from 'src/listings/services/managment.service';
import { AddressDto } from './dto/orders.dto';
import { BufferRequest } from './orders.interface';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(
    private ordersService: OrdersService,
    private listingService: ListingsService,
    private managmentService: ManagmentService,
  ) {}

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
  getAddresses(@User() id: number) {
    return this.ordersService.getRelatedAddresses(id);
  }

  @UseGuards(AuthGuard)
  @Post('/create-intent')
  async createPaymentIntent(@Body('listing_id') listing_id: number, @User() user_id: number) {
    try {
      const { price } = await this.listingService.getById(listing_id);

      const paymentIntent = await this.ordersService.createPaymentIntent(price, { user_id, listing_id });
      return {
        statusCode: 200,
        paymentIntent,
      };
    } catch (error) {
      throw new NotFoundException(`Product with id: ${listing_id} doesnt exist`);
    }
  }

  @Post('/webhook')
  async hanldeIncomingEvent(@Headers('stripe-signature') signature: string, @Req() request: BufferRequest) {
    if (!signature) throw new BadRequestException('Missing stripe-signature header');
    try {
      const event = await this.ordersService.constructEventFromPayload(signature, request.rawBody);

      switch (event.type) {
        case 'payment_intent.succeeded':
          // @ts-ignore
          const { listing_id, user_id, quantity } = event.data.object.charges.data[0].metadata;

          try {
            await this.ordersService.saveOrder({ listing_id, user_id, quantity });
            await this.managmentService.decrementAmmount(listing_id);
          } catch (error) {
            console.warn(error);
          }

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
