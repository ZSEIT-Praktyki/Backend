import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoriesEntity } from './categories.entity';
import { ListingsEntity } from './listings.entity';

@Entity('subcategories')
export class SubcategoriesEntity {
  @PrimaryGeneratedColumn()
  subcategory_id: number;

  @Column({ type: 'varchar', length: '50' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @ManyToOne(() => CategoriesEntity, (type) => type.category_id)
  @JoinColumn({ name: 'category_id' })
  category_id: number;

  @OneToMany(() => ListingsEntity, (type) => type.subcategory_id)
  @JoinColumn({ name: 'listings' })
  listings: ListingsEntity[];
}
