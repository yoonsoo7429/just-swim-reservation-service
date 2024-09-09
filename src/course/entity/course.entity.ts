import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  courseId: number;

  @ManyToOne(() => Users, (user) => user.course)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @Column({ type: 'varchar' })
  courseDays: string;

  @Column({ type: 'varchar' })
  courseTime: string;

  @Column({ type: 'int' })
  courseCapacity: number;

  @CreateDateColumn({ type: 'timestamp' })
  courseCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  courseUpdatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  courseDeletedAt: Date;

  @OneToMany(() => Lecture, (lecture) => lecture.course)
  lecture: Lecture[];
}
