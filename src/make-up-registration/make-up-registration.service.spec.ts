import { Test, TestingModule } from '@nestjs/testing';
import { MakeUpRegistrationService } from './make-up-registration.service';
import { MakeUpRegistration } from './entity/make-up-registration.entity';
import { Users } from 'src/users/entity/users.entity';
import { UserType } from 'src/users/enum/userType.enum';
import { MockMakeUpLectureRepository } from 'src/make-up-lecture/make-up-lecture.service.spec';
import { MakeUpRegistrationRepository } from './make-up-registration.repository';
import { MakeUpLectureRepository } from 'src/make-up-lecture/make-up-lecture.repository';
import { DeleteResult } from 'typeorm';

const mockUser: Users = {
  userId: 2,
  userType: UserType.Customer,
  email: 'customer@example.com',
  provider: 'kakao',
  name: '고객님',
  birth: '1995.09.13',
  phoneNumber: '010-1212-1212',
  profileImage: 'prfile.png',
  userCreatedAt: new Date(),
  userUpdatedAt: new Date(),
  instructor: [],
  customer: [],
  lecture: [],
  member: [],
  attendance: [],
  makeUpLecture: [],
  makeUpRegistration: [],
};
const mockMakeUpLecture = new MockMakeUpLectureRepository().mockMakeUpLecture;

export class MockMakeUpRegistrationRepository {
  readonly mockMakeUpRegistration: MakeUpRegistration = {
    makeUpRegistrationId: 1,
    user: mockUser,
    makeUpLecture: mockMakeUpLecture,
    makeUpRegistrationCreatedAt: new Date(),
    makeUpRegistrationUpdatedAt: new Date(),
  };
}

describe('MakeUpRegistrationService', () => {
  let makeUpRegistrationService: MakeUpRegistrationService;
  let makeUpRegistrationRepository: MakeUpRegistrationRepository;
  let makeUpLectureRepository: MakeUpLectureRepository;

  const mockMakeUpRegistration = new MockMakeUpRegistrationRepository()
    .mockMakeUpRegistration;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MakeUpRegistrationService,
        {
          provide: MakeUpRegistrationRepository,
          useValue: {
            createMakeUpRegistration: jest.fn(),
            deleteMakeUpRegistration: jest.fn(),
            registrationCount: jest.fn(),
          },
        },
        {
          provide: MakeUpLectureRepository,
          useValue: {
            findMakeUpLectureDetail: jest.fn(),
          },
        },
      ],
    }).compile();

    makeUpRegistrationService = module.get<MakeUpRegistrationService>(
      MakeUpRegistrationService,
    );
    makeUpRegistrationRepository = module.get<MakeUpRegistrationRepository>(
      MakeUpRegistrationRepository,
    );
    makeUpLectureRepository = module.get<MakeUpLectureRepository>(
      MakeUpLectureRepository,
    );
  });

  it('should be defined', () => {
    expect(makeUpRegistrationService).toBeDefined();
  });

  describe('createMakeUpRegistration', () => {
    it('보충 예약을 등록하고 예약 정보를 return', async () => {
      const userId = 1;
      const makeUpLectureId = 1;

      (
        makeUpLectureRepository.findMakeUpLectureDetail as jest.Mock
      ).mockResolvedValue(mockMakeUpLecture);
      (
        makeUpRegistrationRepository.registrationCount as jest.Mock
      ).mockResolvedValue(1);
      (
        makeUpRegistrationRepository.createMakeUpRegistration as jest.Mock
      ).mockResolvedValue(mockMakeUpRegistration);

      const result = await makeUpRegistrationService.createMakeUpRegistration(
        userId,
        makeUpLectureId,
      );

      expect(result).toEqual(mockMakeUpRegistration);
    });
  });

  describe('deleteMakeUpRegistration', () => {
    it('보강 예약 취소하고 DeleteResult를 return', async () => {
      const userId = 1;
      const makeUpLectureId = 1;

      (
        makeUpRegistrationRepository.deleteMakeUpRegistration as jest.Mock
      ).mockResolvedValue(DeleteResult);

      const result =
        await makeUpRegistrationRepository.deleteMakeUpRegistration(
          userId,
          makeUpLectureId,
        );

      expect(result).toEqual(DeleteResult);
    });
  });
});
