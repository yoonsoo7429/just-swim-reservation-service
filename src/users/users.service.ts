import {
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UsersDto } from './dto/users.dto';
import { UserType } from './enum/userType.enum';
import { UpdateResult } from 'typeorm';
import { CustomerRepository } from 'src/customer/customer.repository';
import { InstructorRepository } from 'src/instructor/instructor.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly instructorRepository: InstructorRepository,
  ) {}

  /* email, provider를 이용해서 user 조회 */
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    return await this.usersRepository.findUserByEmail(email, provider);
  }

  /* user 회원 가입 */
  async createUser(newUserDto: UsersDto): Promise<Users> {
    return await this.usersRepository.createUser(newUserDto);
  }

  /* userId를 통해 조회 */
  async findUserByPk(userId: number): Promise<Users> {
    return await this.usersRepository.findUserByPk(userId);
  }

  /* userType을 지정 */
  async selectUserType(
    userId: number,
    userType: UserType,
  ): Promise<UpdateResult> {
    const user = await this.usersRepository.findUserByPk(userId);
    if (user.userType !== null) {
      throw new NotAcceptableException('계정에 타입이 이미 지정되어 있습니다.');
    }

    const UpdateResult = await this.usersRepository.selectUserType(
      userId,
      userType,
    );
    if (UpdateResult.affected === 0) {
      throw new InternalServerErrorException('타입 지정 실패');
    }

    // userType update 완료되면 계정에 맞춰 생성
    if (userType === UserType.Customer) {
      await this.customerRepository.createCustomer(userId);
    }
    if (userType === UserType.Instructor) {
      await this.instructorRepository.createInstructor(userId);
    }

    return UpdateResult;
  }
}
