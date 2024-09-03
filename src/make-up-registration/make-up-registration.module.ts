import { forwardRef, Module } from '@nestjs/common';
import { MakeUpRegistrationController } from './make-up-registration.controller';
import { MakeUpRegistrationService } from './make-up-registration.service';
import { MakeUpRegistrationRepository } from './make-up-registration.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakeUpRegistration } from './entity/make-up-registration.entity';
import { MakeUpLectureModule } from 'src/make-up-lecture/make-up-lecture.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MakeUpRegistration]),
    forwardRef(() => MakeUpLectureModule),
  ],
  controllers: [MakeUpRegistrationController],
  providers: [MakeUpRegistrationService, MakeUpRegistrationRepository],
  exports: [MakeUpRegistrationService, MakeUpRegistrationRepository],
})
export class MakeUpRegistrationModule {}
