import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entity/instrutor.entity';
import { Repository } from 'typeorm';

@Injectable()
export class InstructorRepository {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
  ) {}

  /* userType이 customer로 지정 */
  async createInstructor(userId: number): Promise<Instructor> {
    const instructor = new Instructor();
    instructor.user.userId = userId;
    await this.instructorRepository.save(instructor);

    return instructor;
  }
}
