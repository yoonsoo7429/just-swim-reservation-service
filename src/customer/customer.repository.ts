import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entity/customer.entity';
import { Repository } from 'typeorm';
import { CustomerDto } from './dto/customer.dto';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  /* customer 생성 */
  async createCustomer(
    userId: number,
    customerDto: CustomerDto,
  ): Promise<Customer> {
    const {
      customerName,
      customerProfileImage,
      customerBirth,
      customerPhoneNumber,
      customerGender,
      customerAddress,
    } = customerDto;

    const customer = this.customerRepository.create({
      customerName,
      customerProfileImage,
      customerBirth,
      customerPhoneNumber,
      customerGender,
      customerAddress,
      user: { userId },
    });
    await this.customerRepository.save(customer);

    return customer;
  }
}
