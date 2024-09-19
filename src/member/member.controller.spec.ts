import { Test, TestingModule } from '@nestjs/testing';
import { MemberController } from './member.controller';
import { ResponseService } from 'src/common/response/response.service';
import { MemberService } from './member.service';
import { Request, Response } from 'express';
import { MemberDto } from './dto/member.dto';
import { MockMemberRepository } from './member.service.spec';
import { DeleteResult } from 'typeorm';

class MockMemberService {
  createMember = jest.fn();
  deleteMember = jest.fn();
  findAllMembers = jest.fn();
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

  const mockMember = new MockMemberRepository().mockMember;

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

  describe('createMember', () => {
    it('instructor가 customer를 해당 강좌에 member로 등록한다.', async () => {
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

      const req: Partial<Request> = {
        body: { memberDto: MemberDto },
      };

      memberService.createMember.mockResolvedValue(mockMember);

      await memberController.createMember(req.body, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '수강생 등록 성공',
        mockMember,
      );
    });
  });

  describe('deleteMember', () => {
    it('instructor가 customer를 수강 등록을 취소한다.', async () => {
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

      const memberId = 1;

      memberService.deleteMember.mockResolvedValue(DeleteResult);

      await memberController.deleteMember(memberId, res as Response);

      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '수강생 등록 취소',
      );
    });
  });
});
