import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository, UpdateResult } from 'typeorm';
import { UsersDto } from './dto/users.dto';
import { UserType } from './enum/user-type.enum';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  /* email, provider를 이용해 user 조회 */
  async findUserByEmail(
    email: string,
    provider: string,
  ): Promise<Users | undefined> {
    return await this.usersRepository.findOne({
      where: { email, provider },
      relations: ['customer', 'instructor'],
    });
  }

  /* newUser 생성 */
  async createUser(newUserDto: UsersDto): Promise<Users> {
    const { provider, email } = newUserDto;

    const user = this.usersRepository.create({ provider, email });
    await this.usersRepository.save(user);

    return user;
  }

  /* userId를 통해 조회 */
  async findUserByPk(userId: number): Promise<Users> {
    return await this.usersRepository.findOne({
      where: { userId },
      relations: ['customer', 'instructor'],
    });
  }

  /* userType 지정 */
  async selectUserType(
    userId: number,
    userType: UserType,
  ): Promise<UpdateResult> {
    return await this.usersRepository.update({ userId }, { userType });
  }
}
