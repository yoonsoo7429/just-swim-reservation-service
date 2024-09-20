import { Test, TestingModule } from '@nestjs/testing';
import { InstructorService } from './instructor.service';
import { Instructor } from './entity/instrutor.entity';
import { InstructorRepository } from './instructor.repository';
import { Users } from 'src/users/entity/users.entity';
import { InstructorDto } from './dto/instructor.dto';

export class MockInstructorRepository {
  readonly mockInstructor: Instructor = {
    instructorId: 1,
    user: new Users(),
    instructorName: '홍길순',
    instructorPhoneNumber: '010-1235-1235',
    instructorCareer: null,
    instructorProfileImage: null,
    instructorCreatedAt: new Date(),
    instructorUpdatedAt: new Date(),
  };
}

describe('InstructorService', () => {
  let instructorService: InstructorService;
  let instructorRepository: InstructorRepository;

  const mockInstructor = new MockInstructorRepository().mockInstructor;

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

  describe('createInstructor', () => {
    it('강사가 추가 정보를 입력하여 자신의 계정을 활성화한다', async () => {
      const userId = 1;
      const instructorDto: InstructorDto = {
        instructorName: '홍길순',
        instructorPhoneNumber: '010-1235-1235',
        instructorCareer: null,
        instructorProfileImage: null,
      };

      jest
        .spyOn(instructorRepository, 'createInstructor')
        .mockResolvedValue(mockInstructor);

      const result = await instructorService.createInstructor(
        userId,
        instructorDto,
      );

      expect(result).toEqual(mockInstructor);
    });
  });
});
