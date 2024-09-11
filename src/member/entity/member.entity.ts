import { Course } from 'src/course/entity/course.entity';
import { Users } from 'src/users/entity/users.entity';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('member')
export class Member {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  memberId: number;

  // 강좌 member인 customer의 userId
  @ManyToOne(() => Users, (user) => user.member)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Course, (course) => course.member)
  @JoinColumn({ name: 'courseId' })
  course: Course;

  @CreateDateColumn({ type: 'timestamp' })
  memberCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  memberUpdatedAt: Date;
}
