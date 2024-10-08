import { forwardRef, Module } from '@nestjs/common';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Member } from './entity/member.entity';
import { MemberRepository } from './member.repository';
import { CourseModule } from 'src/course/course.module';
import { LectureModule } from 'src/lecture/lecture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Member]),
    forwardRef(() => CourseModule),
    forwardRef(() => LectureModule),
  ],
  controllers: [MemberController],
  providers: [MemberService, MemberRepository],
  exports: [MemberService, MemberRepository],
})
export class MemberModule {}
