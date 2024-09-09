import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Customer } from 'src/customer/entity/customer.entity';
import { CustomerRepository } from './customer.repository';
import { Users } from 'src/users/entity/users.entity';

export class MockCustomerRepository {
  readonly mockCustomer: Customer = {
    customerId: 1,
    user: new Users(),
    customerName: '홍길동',
    customerProfileImage: null,
    customerEnrollment: null,
    customerBirth: '1995.09.13',
    customerPhoneNumber: '010-1234-1234',
    customerGender: '남자',
    customerAddress: '경기도 고양시 일산동구',
    customerCreatedAt: new Date(),
    customerUpdatedAt: new Date(),
  };
}

describe('CustomerService', () => {
  let customerService: CustomerService;
  let customerRepository: CustomerRepository;

  const mockCustomer = new MockCustomerRepository().mockCustomer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        {
          provide: CustomerRepository,
          useValue: { createCustomer: jest.fn() },
        },
      ],
    }).compile();

    customerService = module.get<CustomerService>(CustomerService);
    customerRepository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(customerService).toBeDefined();
  });
});
