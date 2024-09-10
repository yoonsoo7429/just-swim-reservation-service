import { Injectable } from '@nestjs/common';
import { CustomerRepository } from './customer.repository';
import { CustomerDto } from './dto/customer.dto';
import { Customer } from './entity/customer.entity';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  /* customer 정보 생성 */
  async createCustomer(
    userId: number,
    customerDto: CustomerDto,
  ): Promise<Customer> {
    return await this.customerRepository.createCustomer(userId, customerDto);
  }
}
