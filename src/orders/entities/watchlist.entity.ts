import { ListingsEntity } from 'src/listings/entities/listings.entity';
import { UserEntity } from 'src/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('watchlist')
export class WatchListEntity {
  @PrimaryColumn()
  @ManyToOne(() => UserEntity, (type) => type.id)
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;

  @ManyToOne(() => ListingsEntity, (type) => type.listing_id)
  @JoinColumn({ name: 'listing_id' })
  listing_id: ListingsEntity;
}
