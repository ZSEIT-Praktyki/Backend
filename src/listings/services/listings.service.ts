import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import { ListingsEntity } from '../entities/listings.entity';
import { SubcategoriesEntity } from '../entities/subcategories.entity';

const PAGE_SIZE = 12;

@Injectable()
export class ListingsService {
  constructor(
    @InjectRepository(ListingsEntity)
    private listingsRepo: Repository<ListingsEntity>,
    @InjectRepository(SubcategoriesEntity) private subcatRepo: Repository<SubcategoriesEntity>,
  ) {}

  private relations = ['seller_id', 'images', 'subcategory_id', 'subcategory_id.category_id'];

  getPreview(listing_id: number) {
    return this.listingsRepo.findOne({
      where: {
        listing_id,
      },
      relations: ['images'],
      select: ['listing_id', 'title', 'price', 'images', 'added_date', 'city'],
    });
  }

  async getAll(page = 1) {
    return this.listingsRepo
      .find({
        select: ['listing_id', 'title', 'price', 'images', 'added_date', 'city'],
        relations: ['images'],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
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

  getListingById(id: number) {
    return this.listingsRepo.findOneOrFail({
      relations: this.relations,
      where: { listing_id: id }, // the same as fun above but without isActive so that it can be viewed by the buyyer
    });
  }

  async getByQueryText({ query = '', page = 1, min = 0, max, order, subcategory_id, city }) {
    return this.listingsRepo
      .findAndCount({
        select: ['listing_id', 'title', 'price', 'images', 'added_date', 'city'],
        skip: (page - 1) * PAGE_SIZE,
        take: PAGE_SIZE,
        where: {
          title: Like(`%${query}%`),
          price: Between(+min, +max),
          isActive: true,
          ...(city && { city: Like(`%${city}%`) }),
          ...(subcategory_id && { subcategory_id }),
        },
        order: {
          price: order,
        },
        join: {
          alias: 'list',
          leftJoinAndSelect: {
            images: 'list.images',
          },
        },
      })
      .then(([value, amount]) => ({
        amount: Math.ceil(amount / PAGE_SIZE), // amount of pages
        hasMore: (page - 1) * PAGE_SIZE + PAGE_SIZE < amount,
        results: value.map((v) => ({ ...v, images: v.images?.[0] ?? null })),
      }));
  }

  getAllIds() {
    return this.listingsRepo.find({
      select: ['listing_id'],
      where: {
        isActive: true,
      },
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

  subcategories() {
    return this.subcatRepo.find({
      select: ['subcategory_id'],
    });
  }
}
