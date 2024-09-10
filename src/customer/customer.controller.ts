import { Body, Controller, Post, Res } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { ResponseService } from 'src/common/response/response.service';
import { CustomerDto } from './dto/customer.dto';
import { Response } from 'express';

@Controller('customer')
export class CustomerController {
  constructor(
    private readonly responseService: ResponseService,
    private readonly customerService: CustomerService,
  ) {}

  /* userType 지정 후 customer 정보 입력 */
  @Post()
  async createCustomer(@Body() customerDto: CustomerDto, @Res() res: Response) {
    const { userId } = res.locals.user;

    const customer = await this.customerService.createCustomer(
      userId,
      customerDto,
    );

    this.responseService.success(res, '고객 정보 입력 완료', customer);
  }
}
