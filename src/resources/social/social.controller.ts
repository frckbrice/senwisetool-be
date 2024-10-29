import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { SocialService } from './social.service';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { Prisma, Role } from '@prisma/client';

@Controller('socials')
export class SocialController {
  constructor(private readonly socialService: SocialService) { }

  @Post()
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.IT_SUPPORT)
  create(@Body() createSocialDto: Prisma.SocialCreateInput) {
    return this.socialService
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.AUDITOR, Role.IT_SUPPORT)
  findAll(@Query() query: { activity_title: string }, company_id: string) {
    return this.socialService.findAll(query, company_id)
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.AUDITOR, Role.IT_SUPPORT)
  findOne(@Param() id: string) {
    return this.socialService.findOne(id)
  }

  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.IT_SUPPORT)
  update(@Body() updateSocialDto: Prisma.SocialCreateInput, @Param('id') id: string) {
    return this.socialService.update(id, updateSocialDto)
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(Role.ADG,
    Role.IT_SUPPORT
  )
  delete(@Param() id: string) {
    this.socialService.delete(id)
  }

}
