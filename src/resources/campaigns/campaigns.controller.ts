import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CampaignService } from './campaigns.service';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { LoggerService } from 'src/global/logger/logger.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';
import { PaginationCampaignQueryDto } from './dto/paginate-campaign.dto';

@ApiBearerAuth()
@ApiTags('campaigns')
@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignService) {}
  private readonly logger = new LoggerService(CampaignsController.name);
  @Post()
  create(
    @Body() createCampaignDto: Prisma.CampaignCreateInput,
    @CurrentUser() user: any,
  ) {
    return this.campaignsService.create(createCampaignDto, user);
  }

  @Get()
  findAll(query: Partial<PaginationCampaignQueryDto>) {
    return this.campaignsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateCampaignDto: Prisma.CampaignUpdateInput,
  ) {
    return this.campaignsService.update(id, updateCampaignDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignsService.remove(id);
  }
}
