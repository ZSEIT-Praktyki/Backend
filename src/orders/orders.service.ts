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

  async getSaledProducts(seller_id: number) {
    return this.orderRepo
      .createQueryBuilder('ord')
      .leftJoinAndSelect('ord.listing_id', 'list')
      .leftJoinAndSelect('list.images', 'img')
      .where('list.seller_id = :seller_id', { seller_id })
      .getMany()
      .then((r) =>
        r.map((p) => ({
          order_id: p.order_id,
          purchased_at: p.purchased_at,
          listing_id: p.listing_id.listing_id,
          added_date: p.listing_id.added_date,
          title: p.listing_id.title,
          price: p.listing_id.price,
          images: p.listing_id?.images[0] ?? null,
        })),
      );
  }

  async getPurchaseHistory(user_id: number) {
    return this.orderRepo
      .find({
        select: ['order_id', 'purchased_at'],
        where: {
          buyer_id: user_id,
        },
        relations: ['listing_id', 'listing_id.images'],
      })
      .then((r) =>
        r.map((p) => ({
          order_id: p.order_id,
          purchased_at: p.purchased_at,
          listing_id: p.listing_id.listing_id,
          added_date: p.listing_id.added_date,
          title: p.listing_id.title,
          price: p.listing_id.price,
          images: p.listing_id?.images[0] ?? null,
        })),
      );
  }

  getStates() {
    return this.statesRepo.find({ cache: { id: 5, milliseconds: 1000 * 60 * 60 } });
  }

  getRelatedAddresses(user_id: number) {
    return this.addressesRepo.find({
      where: {
        user_id,
      },
    });
  }

  createPaymentIntent(
    price: number,
    { user_id, listing_id, address_id }: { user_id: number; listing_id: number; address_id: number },
  ) {
    return this.#stripe.paymentIntents.create({
      currency: 'eur',
      payment_method_types: ['p24', 'card'],
      amount: price,
      metadata: {
        user_id: +user_id,
        listing_id: +listing_id,
        address_id: +address_id,
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
