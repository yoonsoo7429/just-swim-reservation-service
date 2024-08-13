import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { Users } from './entity/users.entity';
import { UsersDto } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}
