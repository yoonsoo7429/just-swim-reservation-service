import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpLectureService } from './make-up-lecture.service';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { MakeUpLecture } from './entity/make-up-lecture.entity';
import { MockLectureRepository } from 'src/lecture/lecture.service.spec';
import { LectureRepository } from 'src/lecture/lecture.repository';
import { MakeUpLectureRepository } from './make-up-lecture.repository';
import { MakeUpLectureDto } from './dto/make-up-lecture.dto';
import { DeleteResult } from 'typeorm';

const mockUser = new MockUsersRepository().mockUser;
const mockLecture = new MockLectureRepository().mockLecture;

export class MockMakeUpLectureRepository {
  readonly mockMakeUpLecture: MakeUpLecture = {
    makeUpLectureId: 1,
    user: mockUser,
    lecture: mockLecture,
    makeUpLectureDay: '월수금',
    makeUpLectureStartTime: '12:00',
    makeUpLectureEndTime: '13:00',
    makeUpCapacity: 4,
    makeUpLectureCreatedAt: new Date(),
    makeUpLectureUpdatedAt: new Date(),
    makeUpLectureDeletedAt: null,
    makeUpRegistration: [],
  };
}

describe('MakeUpLectureService', () => {
  let makeUpLectureService: MakeUpLectureService;
  let makeUpLectureRepository: MakeUpLectureRepository;
  let lectureRepository: LectureRepository;

  const mockMakeUpLecture = new MockMakeUpLectureRepository().mockMakeUpLecture;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeUpLectureService,
        {
          provide: MakeUpLectureRepository,
          useValue: {
            findMakeUpLectureWithTimeConflict: jest.fn(),
            createMakeUpLecture: jest.fn(),
            findMakeUpLecturesByLectureId: jest.fn(),
            deleteMakeUpLecture: jest.fn(),
          },
        },
        {
          provide: LectureRepository,
          useValue: {
            findLectureDetail: jest.fn(),
          },
        },
      ],
    }).compile();

    makeUpLectureService =
      module.get<MakeUpLectureService>(MakeUpLectureService);
    makeUpLectureRepository = module.get<MakeUpLectureRepository>(
      MakeUpLectureRepository,
    );
    lectureRepository = module.get<LectureRepository>(LectureRepository);
  });

  it('should be defined', () => {
    expect(makeUpLectureService).toBeDefined();
  });

  describe('createMakeUpLecture', () => {
    it('instrcutro가 보충 강의를 열어주고 그에 대한 정보를 return', async () => {
      const userId = mockUser.userId;
      const lectureId = mockLecture.lectureId;
      const makeUpLectureDto: MakeUpLectureDto = {
        lectureId,
        makeUpLectureDay: '2024.09.04',
        makeUpLectureStartTime: '17:00',
        makeUpLectureEndTime: '18:00',
        makeUpCapacity: 4,
      };
      const newMakeUpLecture: MakeUpLecture = {
        makeUpLectureId: 1,
        user: mockUser,
        lecture: mockLecture,
        makeUpLectureDay: makeUpLectureDto.makeUpLectureDay,
        makeUpLectureStartTime: makeUpLectureDto.makeUpLectureStartTime,
        makeUpLectureEndTime: makeUpLectureDto.makeUpLectureEndTime,
        makeUpCapacity: makeUpLectureDto.makeUpCapacity,
        makeUpLectureCreatedAt: new Date(),
        makeUpLectureUpdatedAt: new Date(),
        makeUpLectureDeletedAt: null,
        makeUpRegistration: [],
      };

      (
        makeUpLectureRepository.createMakeUpLecture as jest.Mock
      ).mockResolvedValue(newMakeUpLecture);

      const result = await makeUpLectureService.createMakeUpLecture(
        userId,
        makeUpLectureDto,
      );

      expect(result).toEqual(newMakeUpLecture);
    });
  });

  describe('findMakeUpLecturesByLectureId', () => {
    it('강의에 해당하는 인원을 확인하고 열려있는 보강을 모두 조회해서 return', async () => {
      const userId = 1;
      const lectureId = 1;

      (lectureRepository.findLectureDetail as jest.Mock).mockResolvedValue(
        mockLecture,
      );
      (
        makeUpLectureRepository.findMakeUpLecturesByLectureId as jest.Mock
      ).mockResolvedValue([mockMakeUpLecture]);

      const result = await makeUpLectureService.findMakeUpLecturesByLectureId(
        userId,
        lectureId,
      );

      expect(result).toEqual([mockMakeUpLecture]);
    });
  });

  describe('deleteMakeUpLecture', () => {
    it('lectureId에 해당하는 보강을 instructor가 취소', async () => {
      const userId = 1;
      const lectureId = 1;
      const makeUpLectureDay = '2024.09.04';
      const makeUpLectureStartTime = '16:00';

      (
        makeUpLectureRepository.deleteMakeUpLecture as jest.Mock
      ).mockResolvedValue(DeleteResult);

      const result = await makeUpLectureRepository.deleteMakeUpLecture(
        userId,
        lectureId,
        makeUpLectureDay,
        makeUpLectureStartTime,
      );

      expect(result).toEqual(DeleteResult);
    });
  });
});
