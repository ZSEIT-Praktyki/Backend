import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Stripe from 'stripe';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/orders.entity';
import { UserAddresses } from './entities/user-addresses.entity';
import { OrderProps } from './orders.interface';
import type { AddressProps, ICreateOrder } from './orders.interface';
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
      .leftJoinAndSelect('ord.address_id', 'addr')
      .where('list.seller_id = :seller_id', { seller_id })
      .where('ord.is_paid = :is_paid', { is_paid: true })
      .getMany()
      .then((r) =>
        r.map((p) => ({
          order_id: p.order_id,
          purchased_at: p.purchased_at,
          listing: {
            images: p.listing_id?.images[0] ?? null,
            title: p.listing_id.title,
            quantity: p.listing_id.quantity,
            price: p.listing_id.price,
          },
          buyer_address: {
            ...p.address_id,
          },
        })),
      );
  }

  async getPurchaseHistory(user_id: number) {
    return this.orderRepo
      .find({
        select: ['order_id', 'purchased_at'],
        where: {
          buyer_id: user_id,
          is_paid: true,
          payment_status: 1,
        },
        order: {
          purchased_at: 'DESC',
        },
        relations: ['listing_id', 'listing_id.images'],
      })
      .then((result) => {
        return result.map((order) => ({
          order_id: order.order_id,
          purchased_at: order.purchased_at,
          listing: {
            title: order.listing_id.title,
            image: order.listing_id.images[0] || null,
            listing_id: order.listing_id.listing_id,
            price: order.listing_id.price,
          },
        }));
      });
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

  createPaymentIntent(price: number, orderId: number) {
    return this.#stripe.paymentIntents.create({
      currency: 'eur',
      payment_method_types: ['p24', 'card'],
      amount: price,
      metadata: {
        orderId: orderId,
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

  async createOrder(order: ICreateOrder) {
    return this.orderRepo.insert({
      ...order,
      is_paid: false,
      order_status: 0,
      payment_status: 0,
    });
  }

  async getOrderById(order_id: number) {
    return this.orderRepo.findOne(order_id, {
      relations: ['listing_id', 'address_id'],
    });
  }

  async completeOrder(order_id: number, props: { status: number; payment_intent_id: string }) {
    return this.orderRepo.update(order_id, {
      order_status: props.status,
      payment_intent_id: props.payment_intent_id,
      is_paid: true,
      payment_status: 1,
    });
  }
}
