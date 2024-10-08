import { forwardRef, Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { UsersModule } from 'src/users/users.module';
import { CustomerRepository } from './customer.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Customer]),
    forwardRef(() => UsersModule),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, CustomerRepository],
  exports: [CustomerService, CustomerRepository],
})
export class CustomerModule {}
