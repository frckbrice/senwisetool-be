import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Get,
} from '@nestjs/common';
import { RequirementService } from './requirement.service';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma, Role } from '@prisma/client';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';
import { UserType } from '../users/entities/user.entity';
import {
  existsSync,
  mkdirSync, writeFile, writeFileSync
} from 'node:fs';
import { join } from 'node:path';

@ApiTags('requirements')
@ApiBearerAuth()
@UseGuards(RolesGuard)
@Roles(Role.ADG, Role.PDG)
@Controller('requirements')
export class RequirementController {
  constructor(private readonly requirementService: RequirementService) { }

  // create a new requirement  (only for ADG and PDG)
  @Post()

  @ApiResponse({ status: 201, description: 'successfully created requirement' })
  @ApiOperation({ summary: 'Create requirement' })
  create(@Body() createChapterDto: Prisma.RequirementCreateInput) {
    return this.requirementService.create(createChapterDto);
  }

  // update a spcific requirement
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateChapterDto: Prisma.RequirementUpdateInput,
  ) {
    return this.requirementService.update(id, updateChapterDto);
  }

  // get all requirements for a specific price plan
  // @Get()
  // getAllPricePlan(
  //   @Param('plan_id') plan_id: string,
  //   @CurrentUser() user: UserType,
  // ) {
  //   return this.requirementService.findAllRequirements();
  // }

  @Get()
  async getCurrentCompanySubscriptionRequirements(@CurrentUser() user: UserType) {
    const company_id = <string>user?.company_id;
    // return this.requirementService.getAllFile({
    //   company_id
    // });
     const data = await  this.requirementService.getAllFile();
     console.log("the requirements data from controller: ", data)
     return data;
  }
}
