import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('states')
export class StatesEntity {
  @PrimaryColumn({ type: 'varchar', length: '20' })
  state: string;
}
