import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { KakaoAuthGuard } from 'src/auth/guard/kakao.guard';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { UsersDto } from './dto/users.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  /* kakao social signIn */
  @UseGuards(KakaoAuthGuard)
  @Get('Oauth/kakao')
  async kakaoSignIn(): Promise<void> {
    return;
  }

  @UseGuards(KakaoAuthGuard)
  @Get('Oauth/kakao/callback')
  async kakaoCallback(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    // user 정보
    let profile: any = req.user;
    let provider: string = profile.provider;
    let email: string = profile._json.kakao_account.email;
    let name: string = profile._json.kakao_account.name;
    let profileImage: string = profile._json.properties.profile_image;
    // user birth
    let birthYear: string = profile._json.kakao_account.birthyear;
    let birthDay: string = profile._json.kakao_account.birthday;
    let birth: string = `${birthYear}.${birthDay.substring(0, 2)}.${birthDay.substring(2)}`;
    // phoneNumber
    let phone_number: string = profile._json.kakao_account.phone_number;
    let cleanedNumber: string = phone_number.replace(/\D/g, '');
    let phoneNumber: string = `010-${cleanedNumber.substring(4, 8)}-${cleanedNumber.substring(8, 13)}`;

    // user 확인
    const exUser = await this.authService.validateUser(email, provider);

    if (exUser) {
      const token = await this.authService.getToken(exUser.userId);
    }

    if (!exUser) {
      const newUserDto: UsersDto = {
        provider,
        email,
        name,
        profileImage,
        birth,
        phoneNumber,
      };
      const newUser = await this.usersService.createUser(newUserDto);
      const token = await this.authService.getToken(newUser.userId);
    }
  }
}
