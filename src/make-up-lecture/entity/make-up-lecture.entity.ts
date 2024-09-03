import { Lecture } from 'src/lecture/entity/lecture.entity';
import { MakeUpRegistration } from 'src/make-up-registration/entity/make-up-registration.entity';
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

@Entity('makeUpLecture')
export class MakeUpLecture {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  makeUpLectureId: number;

  @ManyToOne(() => Users, (user) => user.makeUpLecture)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(() => Lecture, (lecture) => lecture.makeUpLecture)
  @JoinColumn({ name: 'lectureId' })
  lecture: Lecture;

  @Column({ type: 'varchar' })
  makeUpLectureDay: string;

  @Column({ type: 'varchar' })
  makeUpLectureStartTime: string;

  @Column({ type: 'varchar' })
  makeUpLectureEndTime: string;

  @Column({ type: 'int' })
  makeUpCapacity: number;

  @CreateDateColumn({ type: 'timestamp' })
  makeUpLectureCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  makeUpLectureUpdatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  makeUpLectureDeletedAt: Date;

  @OneToMany(
    () => MakeUpRegistration,
    (makeUpRegistration) => makeUpRegistration.makeUpLecture,
  )
  makeUpRegistration: MakeUpRegistration[];
}
