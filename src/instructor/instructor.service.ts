import { Injectable } from '@nestjs/common';
import { InstructorRepository } from './instructor.repository';
import { InstructorDto } from './dto/instructor.dto';
import { Instructor } from './entity/instrutor.entity';

@Injectable()
export class InstructorService {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  /* instructor 정보 생성 */
  async createInstructor(
    userId: number,
    instructorDto: InstructorDto,
  ): Promise<Instructor> {
    return await this.instructorRepository.createInstructor(
      userId,
      instructorDto,
    );
  }
}
