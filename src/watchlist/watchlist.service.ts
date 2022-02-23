import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WatchlistEntity } from './watchlist.entity';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(WatchlistEntity)
    private watchRepository: Repository<WatchlistEntity>,
  ) {}

  async getRelatedToUser(user_id: number, skip = 0) {
    return this.watchRepository
      .find({
        where: {
          user_id,
        },
        skip,
        take: 10,

        relations: ['listing_id', 'listing_id.images'],
      })
      .then((res) =>
        res.map((w) => ({
          watchlist_id: w.id,
          listing_id: w.listing_id.listing_id,
          price: w.listing_id.price,
          images: w.listing_id.images?.[0] ?? null,
          added_date: w.listing_id.added_date,
          title: w.listing_id.title,
        })),
      );
  }

  async addWatchlistListing(user_id: number, listing_id: any) {
    return this.watchRepository
      .findOne({
        where: { user_id, listing_id },
      })
      .then((result) => {
        if (typeof result === 'undefined') {
          return this.watchRepository.insert({ user_id, listing_id });
        }
        return Promise.reject('Listing is already in watchlist');
      });
  }

  async removeListingFromWatchlist(watchlist_id: number) {
    return this.watchRepository.delete({
      id: watchlist_id,
    });
  }
}
