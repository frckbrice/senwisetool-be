import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto';
import { UpdateReceiptDto } from './dto/update-receipt.dto';
import { LoggerService } from 'src/global/logger/logger.service';
import { PrismaService } from 'src/adapters/config/prisma.service';

@Injectable()
export class ReceiptsService {
  private logger = new LoggerService(ReceiptsService.name)
  constructor(private prismaService: PrismaService) { }
  
  async create(createReceiptDto: CreateReceiptDto) {

    try {
      // const data = await this.prismaService.receipt.create({
      //   data: createReceiptDto
      // })


    } catch (error) {

    }

    return 'This action adds a new receipt';
  }

  findAll() {
    return `This action returns all receipts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receipt`;
  }

  update(id: number, updateReceiptDto: UpdateReceiptDto) {
    return `This action updates a #${id} receipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} receipt`;
  }
}
