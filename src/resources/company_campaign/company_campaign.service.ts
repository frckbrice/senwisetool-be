import { Injectable } from '@nestjs/common';
import { CreateCompanyCampaignDto } from './dto/create-company_campaign.dto';
import { UpdateCompanyCampaignDto } from './dto/update-company_campaign.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class CompanyCampaignService {
  create(createCompanyCampaignDto: Prisma.Company_CampaignCreateInput) {
    return 'This action adds a new companyCampaign';
  }

  findAll() {
    return `This action returns all companyCampaign`;
  }

  findOne(id: string) {
    return `This action returns a #${id} companyCampaign`;
  }

  update(id: string, updateCompanyCampaignDto: UpdateCompanyCampaignDto) {
    return `This action updates a #${id} companyCampaign`;
  }

  remove(id: string) {
    return `This action removes a #${id} companyCampaign`;
  }
}
