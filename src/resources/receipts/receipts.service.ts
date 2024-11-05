import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, User } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { UsersService } from '../users/users.service';
import { Slugify } from 'src/global/utils/slugilfy';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReceiptService {
  private readonly logger = new LoggerService(ReceiptService.name);

  constructor(
    private readonly prismaService: PrismaService,

  ) { }


  async create(
    createReceiptDto: Prisma.ReceiptCreateInput,
    user: Partial<User>,
  ) {
    // avoid creating receipt twice
    console.log('\n\nreceipt payload: ', createReceiptDto);
    try {

      const result = await this.prismaService.receipt.create({
        data: createReceiptDto
      });
      if (result)
        return {
          data: result,
          status: HttpStatus.CREATED,
          message: `receipt created successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to create receipt`,
        };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        this.logger.error(
          `Error while creating receipt ${error.name}: Validation error \n\n ${error}`,
          ReceiptService.name,
        );
        throw new InternalServerErrorException(
          `Validation Error while creating receipt `
        );
      }

    }
  }

  async findAll(query: any) {
    // find all the receipt with the latest start date with its status and type
    const { page, perPage, market_id } = query;
    const where = Object.create({});

    if (market_id)
      where['market_id'] = market_id;

    let Query = Object.create({ where });
    Query = {
      ...Query,
      take: perPage ?? 20,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        created_at: 'desc',
      },
    };
    // find all the companies
    try {
      const [total, receipts] = await this.prismaService.$transaction([
        this.prismaService.receipt.count(),
        this.prismaService.receipt.findMany(Query),
      ]);
      if (receipts.length)
        return {
          status: 200,
          message: 'receipts fetched successfully',
          data: receipts,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      else
        return {
          status: 400,
          message: 'No receipts found',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
    } catch (error) {
      this.logger.error(
        `Error fetching receipts \n\n ${error}`,
        ReceiptService.name,
      );
      throw new NotFoundException('Error fetching receipts');
    }
  }

  async findOne(receipt_id: string) {
    try {
      const result = await this.prismaService.receipt.findUnique({
        where: {
          id: receipt_id,
        }
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `receipt fetched successfully`,
        };
      else
        return {
          data: null,
          status: 404,
          message: `NOT FOUND receipt with id: "${receipt_id}"`,
        };
    } catch (err) {
      this.logger.error("Can't find a receipt with id ", ReceiptService.name);
      throw new NotFoundException("Can't find a receipt with id " + receipt_id);
    }
  }

  async update(id: string, updateReceiptDto: Prisma.ReceiptUpdateInput) {
    try {
      const result = await this.prismaService.receipt.update({
        data: updateReceiptDto,
        where: {
          id,
        },
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `receipt updated successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update receipt`,
        };
    } catch (err) {
      this.logger.error(
        "Can't update a receipt with id " + id,
        ReceiptService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a receipt with id " + id,
      );
    }
  }

  async remove(receipt_id: string) {
    try {
      const result = await this.prismaService.receipt.delete({
        where: {
          id: receipt_id,
        },
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `receipt deleted successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete receipt`,
        };
    } catch (err) {
      this.logger.error(
        "Can't delete a receipt with receipt_id " + receipt_id,
        ReceiptService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a receipt with receipt_id " + receipt_id,
      );
    }
  }

  // get all companies
}
