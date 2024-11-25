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
import { TransactionService } from './transactions.service';

import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Prisma, Role, User } from '@prisma/client';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { SkipThrottle } from '@nestjs/throttler';
import { CurrentUser } from 'src/global/current-logged-in/current-user.decorator';

// @UseGuards(RolesGuard)
@ApiTags('transactions')
@Controller('transactions')
@SkipThrottle()
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @Post()
  @ApiOperation({ summary: 'create project data' })
  @UseGuards(RolesGuard)
  @Roles(Role.ADG, Role.AGENT, Role.AUDITOR)
  create(
    @Body() createInspectionDatumDto: Prisma.TransactionCreateInput & {
      market_number: string;
    },
  ) {
    return this.transactionService.create(createInspectionDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get()
  @ApiOperation({ summary: 'find all transactions' })
  findAll(@Query() query: any) {
    return this.transactionService.findAll(query);
  }

  // get the current transaction
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Get('current')
  @ApiOperation({ summary: 'find the currently transaction of the connected user' })
  findOne(@CurrentUser() user: Partial<User>) {

    const id = <string>user?.company_id;
    return this.transactionService.findOne(id);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({ summary: 'update one transaction with its id' })
  update(
    @Param('id') id: string,
    @Body() updateInspectionDatumDto: Prisma.TransactionUpdateInput & {
      market_number: string; // This is a new field added to the input DTO
    },
  ) {
    return this.transactionService.update(id, updateInspectionDatumDto);
  }

  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'delete one transaction with its id' })
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
