import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingsEntity } from '../entities/listings.entity';
import type { ListingProps } from '../listings.inteface';

interface UpdateParams {
  title?: string;
  description?: string;
  price?: number;
  quantity?: number;
}

@Injectable()
export class ManagmentService {
  constructor(
    @InjectRepository(ListingsEntity)
    private listingsRepo: Repository<ListingsEntity>,
  ) {}

  async insertListing(props: ListingProps) {
    return this.listingsRepo.insert({
      ...props,
      isActive: true,
    });
  }

  async hasPermission(seller_id: number, listing_id: number) {
    return this.listingsRepo.findOneOrFail({
      where: {
        seller_id,
        listing_id,
      },
    });
  }

  // refactor later
  async updateFieldsByKeys(listing_id: number, { description, price, quantity, title }: UpdateParams) {
    return this.listingsRepo.update(
      { listing_id },
      {
        ...(description && { description }),
        ...(price && { price }),
        ...(quantity && { quantity }),
        ...(title && { title }),
      },
    );
  }

  async archivizeListing(listing_id: number) {
    return this.listingsRepo.update({ listing_id }, { isActive: false });
  }

  async decrementAmmount(listing_id: number) {
    const res = await this.listingsRepo.findOne(listing_id);

    console.log(res.quantity);

    if (res.quantity - 1 > 0) {
      // sets quantity to 1
      return this.listingsRepo.decrement({ listing_id }, 'quantity', res.quantity - 1);
    } else {
      return this.listingsRepo.update({ listing_id }, { isActive: false });
    }
  }

  async getUserActiveListings(user_id: number) {
    return this.listingsRepo
      .find({
        select: ['listing_id', 'title', 'quantity', 'added_date', 'price', 'images'],
        relations: ['images'],
        where: {
          seller_id: user_id,
          isActive: true,
        },
      })
      .then((res) => res.map((list) => ({ ...list, images: list?.images[0] ?? null })));
  }
  async getUserNotActiveListings(user_id: number) {
    return this.listingsRepo
      .find({
        select: ['listing_id', 'title', 'quantity', 'added_date', 'price', 'images'],
        relations: ['images'],
        where: {
          seller_id: user_id,
          isActive: false,
        },
      })
      .then((res) => res.map((list) => ({ ...list, images: list?.images[0] ?? null })));
  }

  activateListing(listing_id: number) {
    return this.listingsRepo.update(
      {
        listing_id,
      },
      { isActive: true },
    );
  }
}
