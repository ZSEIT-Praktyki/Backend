import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoriesEntity } from './categories.entity';

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
}
