import { ListingsEntity } from 'src/listings/entities/listings.entity';
import { UserEntity } from 'src/user/user.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @CreateDateColumn({ insert: true })
  purchased_at: Date;
}
