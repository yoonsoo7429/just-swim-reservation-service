import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './lecture.service';
import { Lecture } from './entity/lecture.entity';
import { MockUsersRepository } from 'src/users/users.service.spec';
import { LectureRepository } from './lecture.repository';
import { AwsService } from 'src/common/aws/aws.service';
import { MemberRepository } from 'src/member/member.repository';
import * as QRCode from 'qrcode';
import { MockMemberRespository } from 'src/member/member.service.spec';
import { LectureDto } from './dto/lecture.dto';
import { UpdateLectureDto } from './dto/updateLecture.dto';

const mockUser = new MockUsersRepository().mockUser;

export class MockLectureRepository {
  readonly mockLecture: Lecture = {
    lectureId: 1,
    user: mockUser,
    lectureTitle: '1:4 소그룹',
    lectureContent:
      '1:4 소그룹 아이들 수업입니다. 개인 진도에 맞춰 진행합니다.',
    lectureDays: '월수금',
    lectureTime: '16:00-17:00',
    lectureEndDate: '2024.10.26',
    lectureQRCode: 'QRCode',
    lectureCreatedAt: new Date(),
    lectureUpdatedAt: new Date(),
    lectureDeletedAt: null,
    member: [],
  };
}

describe('LectureService', () => {
  let lectureService: LectureService;
  let lectureRepository: LectureRepository;
  let awsService: AwsService;
  let memberRepository: MemberRepository;

  const mockLecture = new MockLectureRepository().mockLecture;
  const mockMember = new MockMemberRespository().mockMember;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LectureService,
        {
          provide: LectureRepository,
          useValue: {
            createLecture: jest.fn(),
            saveQRCode: jest.fn(),
            findAllLecturesByInstructor: jest.fn(),
            findLectureDetail: jest.fn(),
            updateLecture: jest.fn(),
            softDeleteLecture: jest.fn(),
          },
        },
        {
          provide: AwsService,
          useValue: {
            uploadImageToS3: jest.fn(),
            deleteImageFromS3: jest.fn(),
            uploadQRCodeToS3: jest.fn(),
          },
        },
        {
          provide: MemberRepository,
          useValue: { findAllLecturesByCustomer: jest.fn() },
        },
      ],
    }).compile();

    lectureService = module.get<LectureService>(LectureService);
    lectureRepository = module.get<LectureRepository>(LectureRepository);
    awsService = module.get<AwsService>(AwsService);
    memberRepository = module.get<MemberRepository>(MemberRepository);
  });

  it('should be defined', () => {
    expect(lectureService).toBeDefined();
  });

  describe('createLecture', () => {
    it('강의를 생성하고 강의 정보를 return', async () => {
      const lectureDto: LectureDto = {
        lectureTitle: '1:4 소그룹',
        lectureContent: '1:4 소그룹 아이들 수업입니다. 초급반입니다.',
        lectureDays: '화목',
        lectureTime: '18:00-19:00',
        lectureEndDate: '2024.10.30',
        lectureQRCode: 'QRCode',
      };
      const newLecture: Lecture = {
        lectureId: 1,
        user: mockUser,
        ...lectureDto,
        lectureCreatedAt: new Date(),
        lectureUpdatedAt: new Date(),
        lectureDeletedAt: null,
        member: [],
      };

      const mockQRCode = `${newLecture.lectureId}`;
      jest.spyOn(QRCode, 'toDataURL').mockResolvedValue(mockQRCode as never);
      (lectureRepository.createLecture as jest.Mock).mockResolvedValue(
        newLecture,
      );
      jest.spyOn(lectureRepository, 'saveQRCode').mockResolvedValue({
        generatedMaps: [],
        raw: {},
        affected: 1,
      });

      const result = await lectureService.createLecture(lectureDto);

      expect(result).toEqual(newLecture);
      expect(lectureRepository.createLecture).toHaveBeenCalledWith(lectureDto);
      expect(QRCode.toDataURL).toHaveBeenCalledWith(
        `${process.env.SERVER_QR_CHECK_URI}?lectureId=${newLecture.lectureId}`,
      );
      expect(awsService.uploadQRCodeToS3).toHaveBeenCalledWith(
        newLecture.lectureId,
        expect.any(String),
      );
    });
  });

  describe('findAllLectures', () => {
    it('강사가 전체 강의를 조회', async () => {
      const userId = 1;
      const userType = 'instructor';
      jest
        .spyOn(lectureRepository, 'findAllLecturesByInstructor')
        .mockResolvedValue([mockLecture]);

      const result = await lectureService.findAllLectures(userId, userType);

      expect(result).toEqual([mockLecture]);
      expect(
        lectureRepository.findAllLecturesByInstructor,
      ).toHaveBeenCalledWith(userId);
    });

    it('수강생이 전체 강의를 조회', async () => {
      const userId = 2;
      const userType = 'customer';
      jest
        .spyOn(memberRepository, 'findAllLecturesByCustomer')
        .mockResolvedValue([mockMember]);

      const result = await lectureService.findAllLectures(userId, userType);

      expect(result).toEqual([[mockMember][0].lecture]);
      expect(memberRepository.findAllLecturesByCustomer).toHaveBeenCalledWith(
        userId,
      );
    });
  });

  describe('findLectureDetail', () => {
    it('lectureId를 통해 강의를 상세 조회해여 lecture를 return', async () => {
      const userId = 1;
      const lectureId = 1;
      jest
        .spyOn(lectureRepository, 'findLectureDetail')
        .mockResolvedValue(mockLecture as Lecture);

      const result = await lectureService.findLectureDetail(userId, lectureId);

      expect(result).toEqual(mockLecture);
      expect(lectureRepository.findLectureDetail).toHaveBeenCalledWith(
        lectureId,
      );
    });
  });

  describe('updateLecture', () => {
    it('수정 내용을 받아 강의를 수정하고 UpdateResult를 return', async () => {
      const userId = 1;
      const lectureId = 1;

      const updateLectureDto: UpdateLectureDto = {
        lectureDays: '월수금',
      };

      jest
        .spyOn(lectureRepository, 'findLectureDetail')
        .mockResolvedValue(mockLecture as Lecture);
      jest.spyOn(lectureRepository, 'updateLecture').mockResolvedValue({
        generatedMaps: [],
        raw: {},
        affected: 1,
      });

      await lectureService.updateLecture(userId, lectureId, updateLectureDto);

      expect(lectureRepository.findLectureDetail).toHaveBeenCalledWith(
        lectureId,
      );
      expect(lectureRepository.updateLecture).toHaveBeenCalledWith(
        lectureId,
        updateLectureDto,
      );
    });
  });

  describe('softDeleteLecture', () => {
    it('lectureId에 해당하는 강의 삭제(softDelete)한 후 UpdateResult를 return', async () => {
      const userId = 1;
      const lectureId = 1;

      jest
        .spyOn(lectureRepository, 'findLectureDetail')
        .mockResolvedValue(mockLecture as Lecture);
      jest.spyOn(lectureRepository, 'softDeleteLecture').mockResolvedValue({
        generatedMaps: [],
        raw: {},
        affected: 1,
      });

      await lectureService.softDeleteLecture(userId, lectureId);

      expect(lectureRepository.findLectureDetail).toHaveBeenCalledWith(
        lectureId,
      );
      expect(lectureRepository.softDeleteLecture).toHaveBeenCalledWith(
        lectureId,
      );
    });
  });
});
