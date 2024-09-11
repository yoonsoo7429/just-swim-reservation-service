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

    const customer = new Customer();
    customer.user.userId = userId;
    customer.customerName = customerName;
    customer.customerProfileImage = customerProfileImage;
    customer.customerBirth = customerBirth;
    customer.customerPhoneNumber = customerPhoneNumber;
    customer.customerGender = customerGender;
    customer.customerAddress = customerAddress;
    await this.customerRepository.save(customer);

    return customer;
  }
}
