import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/userType.enum';

@Entity('users')
export class Users {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  userId: number;

  @Column({ type: 'enum', enum: UserType, nullable: true })
  userType: UserType;

  @Column({ type: 'varchar', nullable: true })
  provider: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  profileImage: string;

  @Column({ type: 'varchar', nullable: true })
  birth: string;

  @Column({ type: 'varchar', nullable: true })
  phoneNumber: string;

  @CreateDateColumn({ type: 'timestamp' })
  userCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  userUpdatedAt: Date;
}
