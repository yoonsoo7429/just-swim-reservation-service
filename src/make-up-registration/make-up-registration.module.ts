import { Module } from '@nestjs/common';
import { MakeUpRegistrationController } from './make-up-registration.controller';
import { MakeUpRegistrationService } from './make-up-registration.service';

@Module({
  controllers: [MakeUpRegistrationController],
  providers: [MakeUpRegistrationService],
})
export class MakeUpRegistrationModule {}
