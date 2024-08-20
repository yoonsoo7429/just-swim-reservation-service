import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  /* userType이 customer로 지정 */
  async createCustomer(userId: number): Promise<Customer> {
    const customer = new Customer();
    customer.user.userId = userId;
    await this.customerRepository.save(customer);

    return customer;
  }
}
