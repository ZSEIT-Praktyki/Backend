import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

// [TODO]: create customer and assign id

@Injectable()
export class OrdersService {
  #stripe: Stripe;

  constructor() {
    this.#stripe = new Stripe(process.env.STRIPE_KEY, {
      typescript: true,
      apiVersion: '2020-08-27',
    });
  }

  createPaymentIntent(price: number) {
    return this.#stripe.paymentIntents.create({
      currency: 'eur',
      payment_method_types: ['p24', 'card'],
      amount: price,
    });
  }

  async constructEventFromPayload(signature: string, payload: Buffer) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_KEY;

    return this.#stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  }

  async createCustomer(props: any) {
    return this.#stripe.customers.create({
      name: props.name,
      email: props.email,
    });
  }

  async retriveIntent(id: string) {
    return this.#stripe.paymentIntents.retrieve(id);
  }
}
