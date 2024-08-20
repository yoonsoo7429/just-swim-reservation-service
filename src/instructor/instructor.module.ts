import { forwardRef, Module } from '@nestjs/common';
import { InstructorController } from './instructor.controller';
import { InstructorService } from './instructor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Instructor } from './entity/instrutor.entity';
import { UsersModule } from 'src/users/users.module';
import { InstructorRepository } from './instructor.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Instructor]),
    forwardRef(() => UsersModule),
  ],
  controllers: [InstructorController],
  providers: [InstructorService, InstructorRepository],
  exports: [InstructorService, InstructorRepository],
})
export class InstructorModule {}
