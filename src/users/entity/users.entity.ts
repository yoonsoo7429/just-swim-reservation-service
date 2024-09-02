import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserType } from '../enum/userType.enum';
import { Customer } from 'src/customer/entity/customer.entity';
import { Instructor } from 'src/instructor/entity/instrutor.entity';
import { Lecture } from 'src/lecture/entity/lecture.entity';
import { Member } from 'src/member/entity/member.entity';
import { Attendance } from 'src/attendance/entity/attendance.entity';
import { MakeUpLecture } from 'src/make-up-lecture/entity/make-up-lecture.entity';
import { MakeUpRegistration } from 'src/make-up-registration/entity/make-up-registration.entity';

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

  @OneToMany(() => Customer, (customer) => customer.user)
  customer: Customer[];

  @OneToMany(() => Instructor, (instructor) => instructor.user)
  instructor: Instructor[];

  @OneToMany(() => Lecture, (lecture) => lecture.user)
  lecture: Lecture[];

  @OneToMany(() => Member, (member) => member.user)
  member: Member[];

  @OneToMany(() => Attendance, (attendance) => attendance.user)
  attendance: Attendance[];

  @OneToMany(() => MakeUpLecture, (makeUpLecture) => makeUpLecture.user)
  makeUpLecture: MakeUpLecture[];

  @OneToMany(
    () => MakeUpRegistration,
    (makeUpRegistration) => makeUpRegistration.user,
  )
  makeUpRegistration: MakeUpRegistration[];
}
