import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { ResponseService } from 'src/common/response/response.service';
import { CustomerService } from './customer.service';
import { Request, Response } from 'express';
import { CustomerDto } from './dto/customer.dto';
import { MockCustomerRepository } from './customer.service.spec';

class MockCustomerService {
  createCustomer = jest.fn();
}

class MockResponseService {
  success = jest.fn();
  error = jest.fn();
  unauthorized = jest.fn();
  notFound = jest.fn();
  conflict = jest.fn();
  forbidden = jest.fn();
  internalServerError = jest.fn();
}

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerService: MockCustomerService;
  let responseService: MockResponseService;

  const mockCustomer = new MockCustomerRepository().mockCustomer;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService },
        { provide: ResponseService, useClass: MockResponseService },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerService = module.get<CustomerService, MockCustomerService>(
      CustomerService,
    );
    responseService = module.get<ResponseService, MockResponseService>(
      ResponseService,
    );
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });

  describe('createCustomer', () => {
    it('userType 지정 후 customer 정보 입력', async () => {
      const res: Partial<Response> = {
        locals: {
          user: {
            userId: 1,
            userType: 'customer',
          },
        },
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      const req: Partial<Request> = {
        body: { customerDto: CustomerDto },
      };

      customerService.createCustomer.mockResolvedValue(mockCustomer);

      await customerController.createCustomer(req.body, res as Response);

      expect(customerService.createCustomer).toHaveBeenCalledWith(
        res.locals.user.userId,
        req.body,
      );
      expect(responseService.success).toHaveBeenCalledWith(
        res,
        '고객 정보 입력 완료',
        mockCustomer,
      );
    });
  });
});
