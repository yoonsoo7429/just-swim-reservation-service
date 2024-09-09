import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UserType } from './enum/userType.enum';
import { UsersDto } from './dto/users.dto';
import { CustomerRepository } from 'src/customer/customer.repository';
import { InstructorRepository } from 'src/instructor/instructor.repository';
import { UpdateResult } from 'typeorm';
import { MockCustomerRepository } from 'src/customer/customer.service.spec';
import { MockInstructorRepository } from 'src/instructor/instructor.service.spec';

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
    lecture: [],
  };
}

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let customerRepository: CustomerRepository;
  let instructorRepository: InstructorRepository;

  const mockUser = new MockUsersRepository().mockUser;
  const mockCustomer = new MockCustomerRepository().mockCustomer;
  const mockInstructor = new MockInstructorRepository().mockInstructor;

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
        {
          provide: CustomerRepository,
          useValue: { createCustomer: jest.fn() },
        },
        {
          provide: InstructorRepository,
          useValue: { createInstructor: jest.fn() },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
    instructorRepository =
      module.get<InstructorRepository>(InstructorRepository);
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
    it('customer를 선택하고 UpdateResult를 return', async () => {
      const userId = 1;
      const userType = UserType.Customer;
      mockUser.userType = null;

      (usersRepository.findUserByPk as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.selectUserType as jest.Mock).mockResolvedValue(
        UpdateResult,
      );
      (customerRepository.createCustomer as jest.Mock).mockResolvedValue(
        mockCustomer,
      );
      (instructorRepository.createInstructor as jest.Mock).mockResolvedValue(
        mockInstructor,
      );

      await usersService.selectUserType(userId, userType);

      expect(usersRepository.selectUserType).toHaveBeenCalledWith(
        userId,
        userType,
      );
      expect(customerRepository.createCustomer).toHaveBeenCalledWith(userId);
      expect(instructorRepository.createInstructor).not.toHaveBeenCalled();
    });

    it('instructor를 선택하고 UpdateResult를 return', async () => {
      const userId = 1;
      const userType = UserType.Instructor;
      mockUser.userType = null;

      (usersRepository.findUserByPk as jest.Mock).mockResolvedValue(mockUser);
      (usersRepository.selectUserType as jest.Mock).mockResolvedValue(
        UpdateResult,
      );
      (customerRepository.createCustomer as jest.Mock).mockResolvedValue(
        mockCustomer,
      );
      (instructorRepository.createInstructor as jest.Mock).mockResolvedValue(
        mockInstructor,
      );

      await usersService.selectUserType(userId, userType);

      expect(usersRepository.selectUserType).toHaveBeenCalledWith(
        userId,
        userType,
      );
      expect(customerRepository.createCustomer).not.toHaveBeenCalled();
      expect(instructorRepository.createInstructor).toHaveBeenCalledWith(
        userId,
      );
    });
  });
});
