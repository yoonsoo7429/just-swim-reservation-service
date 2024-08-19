import { Lecture } from 'src/lecture/entity/lecture.entity';
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

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  attendanceId: number;

  @ManyToOne(() => Users, (user) => user.attendance)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Lecture, (lecture) => lecture.attendance)
  @JoinColumn({ name: 'lectureId' })
  lecture: Lecture;

  @Column({ type: 'varchar' })
  attendanceDay: string;

  @CreateDateColumn({ type: 'timestamp' })
  attendanceCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  attendanceUpdatedAt: Date;
}
