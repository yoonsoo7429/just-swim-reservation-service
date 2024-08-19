import { Attendance } from 'src/attendance/entity/attendance.entity';
import { Member } from 'src/member/entity/member.entity';
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

  @Column({ type: 'varchar' })
  lectureTitle: string;

  @Column({ type: 'mediumtext' })
  lectureContent: string;

  @Column({ type: 'varchar' })
  lectureTime: string;

  @Column({ type: 'varchar' })
  lectureDays: string;

  @Column({ type: 'varchar', nullable: true })
  lectureQRCode: string;

  @Column({ type: 'varchar', nullable: true })
  lectureEndDate: string;

  @CreateDateColumn({ type: 'timestamp' })
  lectureCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  lectureUpdatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  lectureDeletedAt: Date;

  @OneToMany(() => Member, (member) => member.lecture)
  member: Member[];

  @OneToMany(() => Attendance, (attendance) => attendance.lecture)
  attendance: Attendance[];
}
