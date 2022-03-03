import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  readonly id: number;

  @Column({ unique: true, type: 'varchar', length: '70', nullable: false })
  email: string;

  @Column({ type: 'varchar', length: '60', nullable: false, select: false })
  password: string;

  @Column({ type: 'bool', nullable: false, default: false, select: false })
  activated: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  creation_date: Date;

  @Column({ type: 'varchar', length: '40', nullable: true })
  owners_name: string;

  @Column({ type: 'varchar', length: '50', nullable: true })
  owners_surname: string;

  @Column({ type: 'char', length: '12', nullable: true })
  owners_phone: string;

  @Column({ type: 'bigint', select: false, default: 0 })
  income: number;
}
