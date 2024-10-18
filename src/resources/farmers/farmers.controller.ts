import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { FarmersService } from './farmers.service';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('farmers')
@ApiTags('farmers')
export class FarmersController {
  constructor(
    private readonly farmerService: FarmersService,
  ) { }

  @Post()
  create(@Body() createfarmerDto: Prisma.FarmerCreateInput) {
    return this.farmerService.create(createfarmerDto);
  }

  @Get()
  findAll(
    @Query() query: any,
    @CurrentUser() user: Partial<User>
  ) {
    return this.farmerService.findAll(query, <string>user?.company_id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.farmerService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatefarmerDto: Prisma.FarmerUpdateInput,
  ) {
    return this.farmerService.update(id, updatefarmerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.farmerService.remove(id);
  }
}
