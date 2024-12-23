import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('customer')
export class Customer {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  customerId: number;

  @ManyToOne(() => Users, (user) => user.customer)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ type: 'varchar' })
  customerName: string;

  @Column({ type: 'mediumtext', nullable: true })
  customerProfileImage: string;

  @Column({ type: 'varchar' })
  customerBirth: string;

  @Column({ type: 'varchar' })
  customerPhoneNumber: string;

  @Column({ type: 'varchar' })
  customerGender: string;

  @Column({ type: 'varchar' })
  customerPickUpLocation: string;

  @Column({ type: 'varchar' })
  customerDropOffLocation: string;

  @CreateDateColumn({ type: 'timestamp' })
  customerCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  customerUpdatedAt: Date;
}
