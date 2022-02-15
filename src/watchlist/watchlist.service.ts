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

  getRelatedToUser(user_id: number): Promise<WatchlistEntity[]> {
    return this.watchRepository.find({
      where: {
        user_id,
      },
      relations: [
        'listing_id',
        'listing_id.seller_id',
        'listing_id.images',
        'listing_id.subcategory_id',
        'listing_id.subcategory_id.category_id',
      ],
    });
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
