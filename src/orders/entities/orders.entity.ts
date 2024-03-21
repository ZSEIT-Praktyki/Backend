import { ListingsEntity } from 'src/listings/entities/listings.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserAddresses } from './user-addresses.entity';

@Entity('orders')
export class OrderEntity {
  @PrimaryGeneratedColumn()
  order_id: number;

  @ManyToOne(() => ListingsEntity, (t) => t.listing_id, { nullable: false })
  @JoinColumn({ name: 'listing_id' })
  listing_id: ListingsEntity;

  @ManyToOne(() => UserEntity, (type) => type.id, { nullable: false })
  @JoinColumn({ name: 'buyer_id' })
  buyer_id: UserEntity;

  @ManyToOne(() => UserAddresses, (type) => type.address_id)
  @JoinColumn({ name: 'address_id' })
  address_id: UserAddresses;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @CreateDateColumn({ insert: true })
  purchased_at: Date;

  @Column({ type: 'int', nullable: false })
  total: number;

  @Column({ type: 'int', nullable: false })
  order_status: number;

  @Column({ type: 'int', nullable: false })
  payment_status: number;

  @Column({ type: 'varchar', nullable: false })
  payment_intent_id: string;

  @Column({ type: 'boolean', nullable: false })
  is_paid: boolean;
}
