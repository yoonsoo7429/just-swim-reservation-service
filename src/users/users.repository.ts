import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entity/users.entity';
import { Repository } from 'typeorm';
import { UsersDto } from './dto/users.dto';

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
    return await this.usersRepository.findOne({ where: { email, provider } });
  }

  /* newUser 생성 */
  async createUser(newUserDto: UsersDto): Promise<Users> {
    const { provider, email, name, profileImage, birth, phoneNumber } =
      newUserDto;

    const user = new Users();
    user.provider = provider;
    user.email = email;
    user.name = name;
    user.profileImage = profileImage;
    user.birth = birth;
    user.phoneNumber = phoneNumber;
    await this.usersRepository.save(user);

    return user;
  }
}
