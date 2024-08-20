import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { ResponseService } from 'src/common/response/response.service';
import { Response } from 'express';
import { MockMemberRespository } from './member.service.spec';

class MockMemberService {
  findAllMembersByLectureId = jest.fn();
}

class MockResponseService {
  success = jest.fn();
  error = jest.fn();
  unauthorized = jest.fn();
  notFound = jest.fn();
  conflict = jest.fn();
  forbidden = jest.fn();
  internalServerError = jest.fn();
}

describe('MemberController', () => {
  let memberController: MemberController;
  let memberService: MockMemberService;
  let responseService: MockResponseService;

  const mockMember = new MockMemberRespository().mockMember;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MemberController],
      providers: [
        { provide: MemberService, useClass: MockMemberService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    memberController = module.get<MemberController>(MemberController);
    memberService = module.get<MemberService, MockMemberService>(MemberService);
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(memberController).toBeDefined();
  });

  describe('getAllMembersByLectureId', () => {
    it('lectureId에 해당하는 member 목록을 조회하여 return', async () => {
      const lectureId = 1;

      const res: Partial<Response> = {
        locals: {
          user: {
            userId: 1,
            userType: 'instructor',
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      memberService.findAllMembersByLectureId.mockResolvedValue([mockMember]);

      await memberController.getAllMembersByLectureId(
        lectureId,
        res as Response,
      );

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '수강생 목록 조회 성공',
        [mockMember],
      );
    });
  });
});
