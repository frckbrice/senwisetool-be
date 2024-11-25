import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Prisma, Role, User } from '@prisma/client';
import { FarmersService } from './farmers.service';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';

@Controller('farmers')
@ApiTags('farmers')
export class FarmersController {
  constructor(
    private readonly farmerService: FarmersService,
  ) { }

  @Post()
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  create(@Body() createfarmerDto: Prisma.FarmerCreateInput) {
    return this.farmerService.create(createfarmerDto);
  }

  @Get()
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findAll(
    @Query() query: any,
    @CurrentUser() user: Partial<User>,

  ) {
    return this.farmerService.findAll(query, <string>user?.company_id);
  }

  @Get(':id')
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADG,)
  @UseGuards(RolesGuard)
  update(
    @Param('id') id: string,
    @Body() updatefarmerDto: Prisma.FarmerUpdateInput,
  ) {
    return this.farmerService.update(id, updatefarmerDto);
  }

  @Delete(':id')
  @Roles(Role.ADG,)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.farmerService.remove(id);
  }
}