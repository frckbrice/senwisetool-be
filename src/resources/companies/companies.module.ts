import { Module } from '@nestjs/common';
import { ComapnyService } from './companies.service';
import { CompanyController } from './companies.controller';
import { UsersModule } from '../users/users.module';
import { Slugify } from 'src/global/utils/slugilfy';
import { MailModule } from 'src/global/share/mail/mail.module';

@Module({
  imports: [UsersModule, MailModule],
  controllers: [CompanyController],
  providers: [
    ComapnyService,
    Slugify
  ],
})
export class CompaniesModule { }
