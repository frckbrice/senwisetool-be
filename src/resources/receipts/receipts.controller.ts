import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ReceiptsService } from './receipts.service';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { SkipThrottle } from '@nestjs/throttler';
import { Roles } from 'src/global/auth/guards/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('receipts')
@Controller('receipts')
@UseGuards(RolesGuard)
@SkipThrottle()
@ApiBearerAuth()
export class ReceiptsController {
  constructor(private readonly receiptsService: ReceiptsService) {}

  @Post()
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  create(@Body() createReceiptDto: CreateReceiptDto) {
    return this.receiptsService.create(createReceiptDto);
  }

  @Get()
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findAll() {
    return this.receiptsService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADG, Role.AUDITOR)
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.receiptsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
    return this.receiptsService.update(+id, updateReceiptDto);
  }

  @Delete(':id')
  @Roles(Role.ADG)
  @UseGuards(RolesGuard)
  remove(@Param('id') id: string) {
    return this.receiptsService.remove(+id);
  }
}
