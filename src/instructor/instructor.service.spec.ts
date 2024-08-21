import { Test, TestingModule } from '@nestjs/testing';
import { InstructorService } from './instructor.service';
import { Instructor } from './entity/instrutor.entity';
import { InstructorRepository } from './instructor.repository';
import { Users } from 'src/users/entity/users.entity';

export class MockInstructorRepository {
  readonly mockInstructor: Instructor = {
    instructorId: 1,
    user: new Users(),
    introduction: null,
    workingLocation: null,
    career: null,
    history: null,
    curriculum: null,
    youtubeLink: null,
    facebookLink: null,
    instagramLink: null,
    instructorCreatedAt: new Date(),
    instructorUpdatedAt: new Date(),
  };
}

describe('InstructorService', () => {
  let instructorService: InstructorService;
  let instructorRepository: InstructorRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InstructorService,
        {
          provide: InstructorRepository,
          useValue: { createInstructor: jest.fn() },
        },
      ],
    }).compile();

    instructorService = module.get<InstructorService>(InstructorService);
    instructorRepository =
      module.get<InstructorRepository>(InstructorRepository);
  });

  it('should be defined', () => {
    expect(instructorService).toBeDefined();
  });
});
