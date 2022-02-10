import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Condition, ListingsEntity } from '../entities/listings.entity';

interface ListingProps {
  title: string;
  description: string;
  condition: Condition;
  price: number;
  quantity: number;
  seller_id: any;
  subcategory_id: number;
}

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(ListingsEntity)
    private listingsRepo: Repository<ListingsEntity>,
  ) {}

  async insertListing(props: ListingProps) {
    return this.listingsRepo
      .insert({
        ...props,
        condition:
          props.condition === Condition.NEW ? Condition.NEW : Condition.USED,
        isActive: true,
      })
      .then(({ raw }) => {
        if (raw.affectedRows > 0) return true;
        return false;
      });
  }

  getAll() {
    return this.listingsRepo.find({
      relations: ['seller_id', 'images'],
      where: { isActive: true },
    });
  }
}
