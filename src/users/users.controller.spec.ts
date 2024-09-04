import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.guard';
import { Request, Response } from 'express';
import { MockUsersRepository } from './users.service.spec';
import { Users } from './entity/users.entity';
import { UserType } from './enum/userType.enum';
import { ResponseService } from 'src/common/response/response.service';

class MockKakaoAuthGuard {
  canActivate = jest.fn().mockReturnValue(true);
}

class MockUsersService {
  findUserByEmail = jest.fn();
  createUser = jest.fn();
}

class MockAuthService {
  validateUser = jest.fn();
  getToken = jest.fn();
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

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: MockUsersService;
  let authService: MockAuthService;
  let responseService: MockResponseService;

  const mockUser = new MockUsersRepository().mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useClass: MockUsersService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    })
      .overrideGuard(KakaoAuthGuard)
      .useClass(MockKakaoAuthGuard)
      .compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService, MockUsersService>(UsersService);
    authService = module.get<AuthService, MockAuthService>(AuthService);
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('kakaoCallback', () => {
    it('user가 존재하면 token을 발생시키고...', async () => {
      const req = {
        user: {
          provider: 'kakao',
          name: '홍길동',
          _json: {
            kakao_account: {
              email: 'test@example.com',
              birthyear: '1995',
              birthday: '0913',
              phone_number: '+82 10-1234-5678',
            },
            properties: {
              profile_image: null,
            },
          },
        },
      } as unknown as Request;

      const res = {} as Response;

      jest.spyOn(authService, 'validateUser').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'getToken').mockResolvedValue('mock-token');

      await usersController.kakaoCallback(req, res);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'test@example.com',
        'kakao',
      );
      expect(authService.getToken).toHaveBeenCalledWith(mockUser.userId);
    });

    it('user가 없을 경우 newUser를 생성 후에 token 발생', async () => {
      const req = {
        user: {
          provider: 'kakao',
          _json: {
            kakao_account: {
              email: 'new@daum.net',
              name: '홍길순',
              birthyear: '1995',
              birthday: '0913',
              phone_number: '+82 10-9876-5432',
            },
            properties: {
              profile_image: 'newImage.png',
            },
          },
        },
      } as unknown as Request;

      const res = {} as Response;

      const newUserDto = {
        email: 'new@daum.net',
        provider: 'kakao',
        name: '홍길순',
        profileImage: 'newImage.png',
        phoneNumber: '010-9876-5432',
        birth: '1995.09.13',
      };

      const newUser: Users = {
        ...newUserDto,
        userId: 3,
        userType: UserType.Customer,
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

      jest.spyOn(authService, 'validateUser').mockResolvedValue(undefined);
      jest.spyOn(usersService, 'createUser').mockResolvedValue(newUser);
      jest.spyOn(authService, 'getToken').mockResolvedValue('mock-new-token');

      await usersController.kakaoCallback(req, res);

      expect(authService.validateUser).toHaveBeenCalledWith(
        'new@daum.net',
        'kakao',
      );
      expect(usersService.createUser).toHaveBeenCalledWith(newUserDto);
      expect(authService.getToken).toHaveBeenCalledWith(3);
    });
  });
});
