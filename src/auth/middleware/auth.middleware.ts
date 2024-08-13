import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';
import { ResponseService } from 'src/common/response/response.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware<Request, Response> {
  constructor(
    private readonly responseService: ResponseService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationCookies = req.cookies.authorization;
      const authorizationHeaders = req.headers.authorization;
      const authorization = authorizationCookies
        ? `Bearer ` + authorizationCookies
        : authorizationHeaders;

      // Cookie가 존재하지 않을 경우
      if (!authorization) {
        this.responseService.unauthorized(res, '로그인이 필요한 기능입니다.');
      }

      // Cookie가 존재할 경우
      const [tokenType, tokenValue] = authorization.split(' ');
      if (tokenType !== 'Bearer') {
        res.clearCookie('authorization');
        this.responseService.unauthorized(res, '잘못된 쿠키 형식입니다.');
      }

      const { userId } = this.jwtService.verify(tokenValue, {
        secret: process.env.JWT_SECRET,
      });
      const user = await this.usersService.findUserByPk(userId);

      if (user) {
        res.locals.user = user;
        req.user = user;
        next();
      } else {
        this.responseService.notFound(res, '회원 정보가 없습니다.');
      }
    } catch (error) {
      res.clearCookie('authorization');
    }
  }
}
