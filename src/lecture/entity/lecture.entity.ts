import { Course } from 'src/course/entity/course.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('lecture')
export class Lecture {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  lectureId: number;

  @ManyToOne(() => Users, (user) => user.lecture)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Course, (course) => course.lecture)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @Column({ type: 'varchar' })
  lectureDate: string;

  @Column({ type: 'varchar' })
  lectureStartTime: string;

  @Column({ type: 'varchar' })
  lectureEndTime: string;

  @Column({ type: 'varchar' })
  lectureAttendee: string;

  @CreateDateColumn({ type: 'timestamp' })
  lectureCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  lectureUpdatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  lectureDeletedAt: Date;
}
