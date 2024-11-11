import {
  Body,
  Controller,
  Get,
  Param,
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
import { ResponseService } from 'src/common/response/response.service';
import { UserType } from './enum/user-type.enum';

@Controller()
export class UsersController {
  constructor(
    private readonly responseService: ResponseService,
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

    // user 확인
    const exUser = await this.authService.validateUser(email, provider);

    if (exUser) {
      const token = await this.authService.getToken(exUser.userId);
      const query = '?token=' + token;
      if (exUser.customer.length > 0 || exUser.instructor.length > 0) {
        return res.redirect(process.env.SCHEDULE_URI + `/${query}`);
      }
      return res.redirect(
        process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`,
      );
    }

    if (!exUser) {
      const newUserDto: UsersDto = {
        provider,
        email,
      };
      const newUser = await this.usersService.createUser(newUserDto);
      const token = await this.authService.getToken(newUser.userId);
      const query = '?token=' + token;
      if (exUser.customer.length > 0 || exUser.instructor.length > 0) {
        return res.redirect(process.env.SCHEDULE_URI + `/${query}`);
      }
      return res.redirect(
        process.env.SELECT_USERTYPE_REDIRECT_URI + `/${query}`,
      );
    }
  }

  /* userType 선택 */
  @Post('user/:userType')
  async selectUserType(
    @Param('userType') userType: UserType,
    @Res() res: Response,
  ) {
    const { userId } = res.locals.user;

    // userType 기본 체크
    if (!Object.values(UserType).includes(userType)) {
      this.responseService.error(res, '올바른 userType을 지정해주세요.', 400);
    }

    await this.usersService.selectUserType(userId, userType);

    this.responseService.success(res, 'userType 지정 완료');
  }

  /* 나의 프로필 조회 */
  @Get('user/myProfile')
  async getUserProfile(@Res() res: Response) {
    const { userId } = res.locals.user;
    const userProfile = await this.usersService.findUserByPk(userId);

    this.responseService.success(res, '프로필 조회 성공', userProfile);
  }

  /* 개발자를 위한 로그인 */
  @Post('signIn')
  async signIn(
    @Body('email') email: string,
    @Body('provider') provider: string,
    @Res() res: Response,
  ) {
    const user = await this.usersService.findUserByEmail(email, provider);

    let userId: number = user.userId;
    let token: string = await this.authService.getToken(userId);

    res.cookie('authorization', token);
    this.responseService.success(res, 'signIn success');
  }
}
