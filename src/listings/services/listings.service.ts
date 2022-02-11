import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import deleteObjectFields from 'src/utils/helpers/deleteObjectFields';
import { Like, Repository } from 'typeorm';
import { Condition, ListingsEntity } from '../entities/listings.entity';
import type { ListingProps } from '../listings.inteface';

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

  getAll(skip = 0) {
    return this.listingsRepo.find({
      relations: [
        'seller_id',
        'images',
        'subcategory_id',
        'subcategory_id.category_id',
      ],
      skip: skip,
      take: 10,
      where: { isActive: true },
    });
  }

  async getById(id: number) {
    return this.listingsRepo
      .findOne({
        relations: [
          'seller_id',
          'images',
          'subcategory_id',
          'subcategory_id.category_id',
        ],
        where: { listing_id: id },
      })
      .then((response) => {
        return {
          ...response,
          seller_id: deleteObjectFields(response?.seller_id, [
            'password',
            'activated',
          ]),
        };
      });
  }

  async getByQueryText(text: string) {
    return this.listingsRepo
      .find({
        relations: [
          'seller_id',
          'images',
          'subcategory_id',
          'subcategory_id.category_id',
        ],
        where: [
          {
            title: Like(`%${text}%`),
          },
          { description: Like(`%${text}%`) },
        ],
      })
      .then((res) => {
        return res.map((prop) => ({
          ...prop,
          seller_id: deleteObjectFields(prop.seller_id, [
            'password',
            'activated',
          ]),
        }));
      });
  }
}
