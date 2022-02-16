import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ListingsService } from 'src/listings/services/listings.service';
import { Stripe } from 'stripe';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  #stripe: Stripe;

  constructor(private listingService: ListingsService) {
    this.#stripe = new Stripe(process.env.STRIPE_KEY, {
      typescript: true,
      apiVersion: '2020-08-27',
    });
  }

  @Post('/create-intent')
  async createPaymentIntent(@Body('listing_id') listing_id: number) {
    try {
      const { price } = await this.listingService.getById(listing_id);

      const paymentIntent = await this.#stripe.paymentIntents.create({
        currency: 'pln',
        payment_method_types: ['p24'],
        amount: price,
      });
      return {
        statusCode: 200,
        paymentIntent,
      };
    } catch (error) {
      throw new NotFoundException(`Product with id: ${listing_id} doesnt exist`);
    }
  }
}
