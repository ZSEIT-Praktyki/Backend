import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { ListingsEntity } from '../entities/listings.entity';

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(ListingsEntity)
    private listingsRepo: Repository<ListingsEntity>,
  ) {}

  private relations = ['seller_id', 'images', 'subcategory_id', 'subcategory_id.category_id'];

  async getAll(skip = 0) {
    return this.listingsRepo
      .find({
        //prettier-ignore
        select:["listing_id","title","price","images"],
        relations: ['images'],
        skip: skip,
        take: 10,
        where: { isActive: true },
      })
      .then((res) => res.map((list) => ({ ...list, images: list.images[0] ?? null })));
  }

  getById(id: number) {
    return this.listingsRepo.findOneOrFail({
      relations: this.relations,
      where: { listing_id: id, isActive: true },
    });
  }

  getByQueryText(text: string) {
    return this.listingsRepo.find({
      relations: this.relations,
      where: [
        {
          title: Like(`%${text}%`),
        },
        { description: Like(`%${text}%`) },
      ],
    });
  }

  getAllIds() {
    return this.listingsRepo.find({
      select: ['listing_id'],
    });
  }

  getbySubCategory(subCatId: number) {
    return this.listingsRepo
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.images', 'images')
      .leftJoinAndSelect('list.seller_id', 'seller')
      .leftJoinAndSelect('list.subcategory_id', 'subcategory')
      .leftJoinAndSelect('subcategory.category_id', 'category')
      .orderBy('images.order')
      .where('list.subcategory_id = :subCatId', { subCatId })
      .getMany();
  }

  getByCategory(catId: number) {
    return this.listingsRepo
      .createQueryBuilder('list')
      .leftJoinAndSelect('list.images', 'images')
      .leftJoinAndSelect('list.seller_id', 'seller')
      .leftJoinAndSelect('list.subcategory_id', 'subcategory')
      .leftJoinAndSelect('subcategory.category_id', 'category')
      .orderBy('images.order')
      .where('subcategory.category_id = :catId', { catId })
      .getMany();
  }

  getSellerListings(seller_id: number) {
    return this.listingsRepo.find({
      where: { seller_id },
      relations: this.relations,
    });
  }
}
