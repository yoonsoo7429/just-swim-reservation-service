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

@Entity('instructor')
export class Instructor {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  instructorId: number;

  @ManyToOne(() => Users, (user) => user.instructor)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ type: 'varchar' })
  instructorName: string;

  @Column({ type: 'varchar' })
  instructorPhoneNumber: string;

  @Column({ type: 'varchar', nullable: true })
  instructorProfileImage: string;

  @CreateDateColumn({ type: 'timestamp' })
  instructorCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  instructorUpdatedAt: Date;
}
