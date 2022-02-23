import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ListingsEntity } from './listings.entity';

@Entity('listings_images')
export class ListingsImagesEntity {
  @PrimaryGeneratedColumn()
  photo_id: number;

  @Column({ type: 'varchar' })
  filename: string;

  @Column({ type: 'int' }) // max 1 length
  order: number;

  @ManyToOne(() => ListingsEntity, (type) => type.listing_id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'listing_id' })
  listing_id: number;
}
