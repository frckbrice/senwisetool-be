import { Module } from '@nestjs/common';
import { CampaignService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';

@Module({
  controllers: [CampaignsController],
  providers: [CampaignService],
})
export class CampaignsModule { }
