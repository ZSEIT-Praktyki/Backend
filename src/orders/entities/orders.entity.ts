import { ListingsEntity } from 'src/listings/entities/listings.entity';
import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => ListingsEntity, (t) => t.listing_id)
  @JoinColumn({ name: 'listing_id' })
  listing_id: ListingsEntity;

  @ManyToOne(() => UserEntity, (type) => type.id)
  @JoinColumn({ name: 'buyer_id' })
  buyer_id: number;

  @Column({ type: 'int' })
  quantity: number;
}
