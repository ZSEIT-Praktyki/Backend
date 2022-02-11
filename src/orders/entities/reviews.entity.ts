import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('reviews')
export class ReviewsEntity {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => UserEntity, (type) => type.id)
  @JoinColumn({ name: 'issuer_id' })
  issuer_id: UserEntity;

  @ManyToOne(() => UserEntity, (type) => type.id)
  @JoinColumn({ name: 'recipient_id' })
  recipient_id: UserEntity;

  @Column({ type: 'bool' })
  rating: boolean;

  @Column({ type: 'varchar' })
  review_content: string;
}
