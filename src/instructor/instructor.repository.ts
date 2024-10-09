import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Instructor } from './entity/instrutor.entity';
import { Repository } from 'typeorm';
import { InstructorDto } from './dto/instructor.dto';

@Injectable()
export class InstructorRepository {
  constructor(
    @InjectRepository(Instructor)
    private instructorRepository: Repository<Instructor>,
  ) {}

  /* instructor 생성 */
  async createInstructor(
    userId: number,
    instructorDto: InstructorDto,
  ): Promise<Instructor> {
    const { instructorName, instructorProfileImage, instructorPhoneNumber } =
      instructorDto;

    const instructor = this.instructorRepository.create({
      instructorName,
      instructorProfileImage,
      instructorPhoneNumber,
      user: { userId },
    });
    await this.instructorRepository.save(instructor);

    return instructor;
  }
}
