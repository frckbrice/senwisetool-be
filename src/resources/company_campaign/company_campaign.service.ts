import { Injectable } from '@nestjs/common';
import { CreateCompanyCampaignDto } from './dto/create-company_campaign.dto';
import { UpdateCompanyCampaignDto } from './dto/update-company_campaign.dto';

@Injectable()
export class CompanyCampaignService {
  create(createCompanyCampaignDto: CreateCompanyCampaignDto) {
    return 'This action adds a new companyCampaign';
  }

  findAll() {
    return `This action returns all companyCampaign`;
  }

  findOne(id: number) {
    return `This action returns a #${id} companyCampaign`;
  }

  update(id: number, updateCompanyCampaignDto: UpdateCompanyCampaignDto) {
    return `This action updates a #${id} companyCampaign`;
  }

  remove(id: number) {
    return `This action removes a #${id} companyCampaign`;
  }
}
