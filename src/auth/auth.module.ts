import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { JwtService } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, KakaoStrategy, JwtService],
  exports: [AuthService, PassportModule, JwtService],
})
export class AuthModule {}
