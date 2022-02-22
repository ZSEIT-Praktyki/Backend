import { BadRequestException, Body, Controller, Headers, NotFoundException, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListingsService } from 'src/listings/services/listings.service';
import { BufferRequest } from './orders.interface';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService, private listingService: ListingsService) {}

  @Post('/create-intent')
  async createPaymentIntent(@Body('listing_id') listing_id: number) {
    try {
      const { price } = await this.listingService.getById(listing_id);

      const paymentIntent = await this.ordersService.createPaymentIntent(price);
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
        case '':
          console.log(event);
          break;
      }
    } catch (error) {
      console.warn(error);
    }
  }
}
