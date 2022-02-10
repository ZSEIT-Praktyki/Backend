import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ListingsEntity } from './listings.entity';

@Entity('order')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => ListingsEntity, (type) => type.listing_id)
  @JoinColumn({ name: 'listing_id' })
  listing_id: number;

  @Column({ type: 'int' })
  quantity: number;
}
