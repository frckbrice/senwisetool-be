import { Module } from '@nestjs/common';
import { ComapnyService } from './companies.service';
import { CompanyController } from './companies.controller';

@Module({
  controllers: [CompanyController],
  providers: [ComapnyService],
})
export class CompaniesModule { }
