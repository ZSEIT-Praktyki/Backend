import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('subcategories')
export class SubcategoriesEntity {
  @PrimaryGeneratedColumn()
  subcategory_id: number;

  @Column({ type: 'varchar', length: '50' })
  name: string;

  @Column({ type: 'text' })
  description: string;
}
