import { UserEntity } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ListingsImagesEntity } from './listings-images.entity';
import { SubcategoriesEntity } from './subcategories.entity';

export enum Condition {
  NEW = 'New',
  USED = 'Used',
}

@Entity('listings')
export class ListingsEntity {
  @PrimaryGeneratedColumn()
  listing_id: number;

  @Column({ type: 'varchar', length: '70', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'enum', enum: Condition })
  condition: Condition;

  @Column({ type: 'int', nullable: false })
  price: number;

  @Column({ type: 'int', nullable: false })
  quantity: number;

  @CreateDateColumn({ insert: true, type: 'timestamp' })
  added_date: Date;

  @Column({ type: 'timestamp', nullable: true })
  ending_date: Date;

  @Column({ type: 'bool' })
  isActive: boolean;

  @ManyToOne(() => UserEntity, (type) => type.id)
  @JoinColumn({ name: 'seller_id' })
  seller_id: UserEntity;

  @OneToMany(() => ListingsImagesEntity, (type) => type.listing_id)
  @JoinColumn({ name: 'images' })
  images: ListingsImagesEntity[];

  @ManyToOne(() => SubcategoriesEntity, (type) => type.subcategory_id)
  @JoinColumn({ name: 'subcategory_id' })
  subcategory_id: number;
}
