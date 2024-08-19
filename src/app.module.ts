import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { ResponseModule } from './common/response/response.module';
import { InstructorModule } from './instructor/instructor.module';
import { CustomerModule } from './customer/customer.module';
import { LectureModule } from './lecture/lecture.module';
import { MemberModule } from './member/member.module';
import { AuthMiddleware } from './auth/middleware/auth.middleware';
import { AwsModule } from './common/aws/aws.module';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/response/http-exception.filter';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // db 설정
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_DATABASE'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        // synchronize: true,
        synchronize: false,
      }),
      inject: [ConfigService],
    }),
    ResponseModule,
    AwsModule,
    UsersModule,
    AuthModule,
    InstructorModule,
    CustomerModule,
    LectureModule,
    MemberModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(
      // Lecture
      { path: 'lecture', method: RequestMethod.POST },
      { path: 'lecture', method: RequestMethod.GET },
      { path: 'lecture/:lectureId', method: RequestMethod.GET },
      { path: 'lecture/:lectureId', method: RequestMethod.PUT },
      { path: 'lecture/:lectureId', method: RequestMethod.DELETE },
      // Attendacne
      { path: 'attendance', method: RequestMethod.POST },
      { path: 'attendance', method: RequestMethod.DELETE },
    );
  }
}
