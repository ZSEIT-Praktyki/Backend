import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories')
export class CategoriesEntity {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ type: 'varchar', length: '50' })
  category_name: string;

  @Column({ type: 'varchar', length: '150' })
  description: string;
}
