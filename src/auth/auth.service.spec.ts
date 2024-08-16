import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import { MockUsersRepository } from 'src/users/users.service.spec';

jest.mock('jsonwebtoken');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser = new MockUsersRepository().mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findUserByEmail: jest.fn(),
            createUser: jest.fn(),
            findUserByPk: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('user의 가입 여부 확인', async () => {
      (usersService.findUserByEmail as jest.Mock).mockResolvedValue(mockUser);

      const result = await authService.validateUser(
        mockUser.email,
        mockUser.provider,
      );

      expect(result).toEqual(mockUser);
    });
  });

  describe('getToken', () => {
    it('user가 있을 경우 jsonwebtoken을 받는다.', async () => {
      const userId = 1;
      const accessToken = 'mocked_access_token';
      (jwt.sign as jest.Mock).mockReturnValue(accessToken);

      const result = await authService.getToken(userId);

      expect(result).toEqual(accessToken);
      expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.JWT_SECRET);
    });
  });
});
