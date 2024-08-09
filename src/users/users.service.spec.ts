import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UserType } from './enum/userType.enum';
import { UsersDto } from './dto/users.dto';

export class MockUsersRepository {
  readonly mockUser: Users = {
    userId: 1,
    userType: UserType.Instructor,
    email: 'test@example.com',
    provider: 'kakao',
    name: '홍길동',
    birth: '1993.02.13',
    phoneNumber: '010-1234-1234',
    profileImage: 'profileImage.png',
    userCreatedAt: new Date(),
    userUpdatedAt: new Date(),
  };
}

const mockUser = new MockUsersRepository().mockUser;

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: { findUserByEmail: jest.fn(), createUser: jest.fn() },
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
        userType: UserType.Customer,
        email: 'new@example.com',
        provider: 'kakao',
        name: '홍길순',
        profileImage: 'prof.png',
        phoneNumber: '010-1616-1616',
        birth: '1995.09.13',
      };
      const newUser = new Users();
      newUser.userId = 2;
      newUser.userType = newUserDto.userType;
      newUser.email = newUserDto.email;
      newUser.provider = newUserDto.provider;
      newUser.name = newUserDto.name;
      newUser.profileImage = newUserDto.profileImage;
      newUser.birth = newUserDto.birth;
      newUser.userCreatedAt = new Date();
      newUser.userUpdatedAt = new Date();

      jest.spyOn(usersRepository, 'createUser').mockResolvedValue(newUser);

      const result = await usersService.createUser(newUserDto);
      expect(result).toEqual(newUser);
      expect(usersRepository.createUser).toHaveBeenCalledWith(newUserDto);
    });
  });
});
