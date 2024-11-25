import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ReceiptService, ReceiptTypeWithoutFarmerId } from './receipts.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, Role, User } from '@prisma/client';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';

// @UseGuards(RolesGuard)
@ApiTags('receipts')
@Controller('receipts')
@SkipThrottle()
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) { }

  @Post()
  @ApiOperation({ summary: 'create project data' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.AGENT)
  create(
    @Body() createreceiptDatumDto: Prisma.ReceiptUncheckedCreateInput | ReceiptTypeWithoutFarmerId,
    @CurrentUser() user: Partial<User>,
  ) {
    return this.receiptService.create(createreceiptDatumDto, user);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'find all receipts' })
  findAll(@Query() query: any, @CurrentUser() user: Partial<User>) {
    return this.receiptService.findAll(query, <string>user?.company_id);
  }

  // get the current receipt
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get(':id')
  @ApiOperation({ summary: 'find the currently receipt of the connected user' })
  findOne(@Param('id') id: string) {

    return this.receiptService.findOne(id);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update one receipt with its id' })
  update(
    @Param('id') id: string,
    @Body() updateReceiptDatumDto: Prisma.ReceiptUpdateInput,
  ) {
    return this.receiptService.update(id, updateReceiptDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete one receipt with its id' })
  remove(@Param('id') id: string) {
    return this.receiptService.remove(id);
  }
}