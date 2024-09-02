import { Module } from '@nestjs/common';
import { ComapnyService } from './companies.service';
import { CompanyController } from './companies.controller';
import { UsersModule } from '../users/users.module';
import { Slugify } from 'src/global/utils/slugilfy';

@Module({
  imports: [UsersModule],
  controllers: [CompanyController],
  providers: [ComapnyService, Slugify],
})
export class CompaniesModule { }
