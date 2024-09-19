import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UserType } from './enum/user-type.enum';
import { UsersDto } from './dto/users.dto';
import { UpdateResult } from 'typeorm';

export class MockUsersRepository {
  readonly mockUser: Users = {
    userId: 1,
    userType: UserType.Instructor,
    email: 'test@example.com',
    provider: 'kakao',
    userCreatedAt: new Date(),
    userUpdatedAt: new Date(),
    instructor: [],
    customer: [],
    member: [],
    course: [],
    lecture: [],
  };
}

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  const mockUser = new MockUsersRepository().mockUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findUserByEmail: jest.fn(),
            findUserByPk: jest.fn(),
            createUser: jest.fn(),
            selectUserType: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('findUserByEmail', () => {
    it('email에 해당하는 user를 return', async () => {
      const email = 'test@example.com';
      const provider = 'kakao';
      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(mockUser);

      const result = await usersService.findUserByEmail(email, provider);
      expect(result).toEqual(mockUser);
      expect(usersRepository.findUserByEmail).toHaveBeenCalledWith(
        email,
        provider,
      );
    });

    it('찾지 못할 경우 undefined를 return', async () => {
      const email = 'nonexistent@example.com';
      const provider = 'google';

      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(undefined);

      const result = await usersService.findUserByEmail(email, provider);
      expect(result).toBeUndefined();
      expect(usersRepository.findUserByEmail).toHaveBeenCalledWith(
        email,
        provider,
      );
    });
  });

  describe('createUser', () => {
    it('새로운 user를 생성 후에 user를 return', async () => {
      const newUserDto: UsersDto = {
        email: 'new@example.com',
        provider: 'kakao',
      };
      const newUser = new Users();
      newUser.userId = 2;
      newUser.email = newUserDto.email;
      newUser.provider = newUserDto.provider;
      newUser.userCreatedAt = new Date();
      newUser.userUpdatedAt = new Date();

      jest.spyOn(usersRepository, 'createUser').mockResolvedValue(newUser);

      const result = await usersService.createUser(newUserDto);
      expect(result).toEqual(newUser);
      expect(usersRepository.createUser).toHaveBeenCalledWith(newUserDto);
    });
  });

  describe('selectUserType', () => {
    it('userType을 선택하고 UpdateResult를 return', async () => {
      const userId = 1;
      const userType = UserType.Customer || UserType.Instructor;
      mockUser.userType = null;

      (usersRepository.findUserByPk as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.selectUserType as jest.Mock).mockResolvedValue(
        UpdateResult,
      );

      await usersService.selectUserType(userId, userType);

      expect(usersRepository.selectUserType).toHaveBeenCalledWith(
        userId,
        userType,
      );
    });
  });
});
