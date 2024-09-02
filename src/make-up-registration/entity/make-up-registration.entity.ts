import { MakeUpLecture } from 'src/make-up-lecture/entity/make-up-lecture.entity';
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

@Entity('makeUpRegistration')
export class MakeUpRegistration {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  makeUpRegistrationId: number;

  @ManyToOne(() => Users, (user) => user.makeUpRegistration)
  @JoinColumn({ name: 'userId' })
  user: Users;

  @ManyToOne(
    () => MakeUpLecture,
    (makeUpLecture) => makeUpLecture.makeUpRegistration,
  )
  @JoinColumn({ name: 'makeUpLectureId' })
  makeUpLecture: MakeUpLecture;

  @CreateDateColumn({ type: 'timestamp' })
  makeUpRegistrationCreatedAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  makeUpRegistrationUpdatedAt: Date;
}
