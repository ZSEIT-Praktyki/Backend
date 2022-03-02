import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/orders.entity';
import { UserAddresses } from './entities/user-addresses.entity';
import { OrderProps } from './orders.interface';
import type { AddressProps } from './orders.interface';
import { StatesEntity } from './entities/states.entity';

@Injectable()
export class OrdersService {
  #stripe: Stripe;

  constructor(
    @InjectRepository(OrderEntity) private orderRepo: Repository<OrderEntity>,
    @InjectRepository(UserAddresses) private addressesRepo: Repository<UserAddresses>,
    @InjectRepository(StatesEntity) private statesRepo: Repository<StatesEntity>,
  ) {
    this.#stripe = new Stripe(process.env.STRIPE_KEY, {
      typescript: true,
      apiVersion: '2020-08-27',
    });
  }

  setUserAddress(addresses: AddressProps) {
    return this.addressesRepo.insert(addresses);
  }

  getStates() {
    return this.statesRepo.find();
  }

  getRelatedAddresses(user_id: number) {
    return this.addressesRepo.find({
      where: {
        user_id,
      },
    });
  }

  createPaymentIntent(price: number, { user_id, listing_id }: { user_id: number; listing_id: number }) {
    return this.#stripe.paymentIntents.create({
      currency: 'eur',
      payment_method_types: ['p24', 'card'],
      amount: price,
      metadata: {
        user_id: +user_id,
        listing_id: +listing_id,
        quantity: 1, // make dynamic later
      },
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

  async saveOrder({ quantity, listing_id, user_id }: OrderProps) {
    return this.orderRepo.insert({ quantity: +quantity, listing_id: listing_id, buyer_id: user_id });
  }
}
