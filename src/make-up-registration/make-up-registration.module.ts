import { Module } from '@nestjs/common';
import { MakeUpRegistrationController } from './make-up-registration.controller';
import { MakeUpRegistrationService } from './make-up-registration.service';
import { MakeUpRegistrationRepository } from './make-up-registration.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MakeUpRegistration } from './entity/make-up-registration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MakeUpRegistration])],
  controllers: [MakeUpRegistrationController],
  providers: [MakeUpRegistrationService, MakeUpRegistrationRepository],
  exports: [MakeUpRegistrationService, MakeUpRegistrationRepository],
})
export class MakeUpRegistrationModule {}
