import { UserEntity } from 'src/user/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { StatesEntity } from './states.entity';

@Entity('user_addresses')
export class UserAddresses {
  @PrimaryGeneratedColumn()
  address_id: number;

  @Column({ type: 'varchar', length: '40' })
  name: string;

  @Column({ type: 'varchar', length: '50' })
  surname: string;

  @Column({ type: 'varchar', length: '60' })
  street: string;

  @Column({ type: 'varchar', length: '10' })
  street_number: string;

  @Column({ type: 'varchar', length: '10' })
  apartment_number: string;

  @Column({ type: 'char', length: '5' })
  postal_code: string;

  @Column({ type: 'varchar', length: '60' })
  city: string;

  @Column({ type: 'char', length: '12' })
  phone: string;

  @ManyToOne(() => StatesEntity, (type) => type.state)
  @JoinColumn({ name: 'state' })
  state: string;

  @ManyToOne(() => UserEntity, (type) => type.id)
  @JoinColumn({ name: 'user_id' })
  user_id: UserEntity;
}
