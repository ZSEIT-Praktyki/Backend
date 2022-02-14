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

  private relations = [
    'seller_id',
    'images',
    'subcategory_id',
    'subcategory_id.category_id',
  ];

  getAll(skip = 0) {
    return this.listingsRepo.find({
      relations: this.relations,
      skip: skip,
      take: 10,
      where: { isActive: true },
    });
  }

  getById(id: number) {
    return this.listingsRepo.findOneOrFail({
      relations: this.relations,
      where: { listing_id: id },
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

  hasPermissionToEdit(listing_id: number, seller_id: number) {
    return this.listingsRepo.findOne({
      where: {
        listing_id,
        seller_id,
      },
    });
  }
}
