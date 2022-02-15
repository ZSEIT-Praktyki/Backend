import { ListingsEntity } from 'src/listings/entities/listings.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('watchlist')
export class WatchlistEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ListingsEntity, (t) => t.listing_id)
  @JoinColumn({ name: 'listing_id' })
  listing_id: ListingsEntity;

  @ManyToOne(() => UserEntity, (t) => t.id)
  @JoinColumn({ name: 'user_id' })
  user_id: number;
}
