import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ListingsEntity } from '../entities/listings.entity';
import type { ListingProps } from '../listings.inteface';
import { Condition } from '../entities/listings.entity';

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
      condition: props.condition === Condition.NEW ? Condition.NEW : Condition.USED,
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
}
