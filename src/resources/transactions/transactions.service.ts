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
export class TransactionService {
  private readonly logger = new LoggerService(TransactionService.name);

  constructor(
    private readonly prismaService: PrismaService,
  ) { }


  async create(
    createTransactionDto: Prisma.TransactionCreateInput,
    user: Partial<User>,
  ) {
    // avoid creating transaction twice
    console.log('\n\ntransaction payload: ', createTransactionDto);
    try {

      const result = await this.prismaService.transaction.create({
        data: createTransactionDto
      });
      if (result)
        return {
          data: result,
          status: HttpStatus.CREATED,
          message: `transaction created successfully`,
        };
      else
        return {
          data: null,
          status: HttpStatus.BAD_REQUEST,
          message: `Failed to create transaction`,
        };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        this.logger.error(
          `Error while creating transaction ${error.name}: Validation error \n\n ${error}`,
          TransactionService.name,
        );
        throw new InternalServerErrorException(
          `Validation Error while creating transaction `
        );
      }

    }
  }

  async findAll(query: any) {
    // find all the transaction with the latest start date with its status and type
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
      const [total, transactions] = await this.prismaService.$transaction([
        this.prismaService.transaction.count(),
        this.prismaService.transaction.findMany(Query),
      ]);
      if (transactions.length)
        return {
          status: 200,
          message: 'transactions fetched successfully',
          data: transactions,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      else
        return {
          status: 400,
          message: 'No transactions found',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
    } catch (error) {
      this.logger.error(
        `Error fetching transactions \n\n ${error}`,
        TransactionService.name,
      );
      throw new NotFoundException('Error fetching transactions');
    }
  }

  async findOne(transaction_id: string) {
    try {
      const result = await this.prismaService.transaction.findUnique({
        where: {
          id: transaction_id,
        }
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `transaction fetched successfully`,
        };
      else
        return {
          data: null,
          status: 404,
          message: `NOT FOUND transaction with id: "${transaction_id}"`,
        };
    } catch (err) {
      this.logger.error("Can't find a transaction with id ", TransactionService.name);
      throw new NotFoundException("Can't find a transaction with id " + transaction_id);
    }
  }

  async update(id: string, updateTransactionDto: Prisma.TransactionUpdateInput) {
    try {
      const result = await this.prismaService.transaction.update({
        data: updateTransactionDto,
        where: {
          id,
        },
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `transaction updated successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update transaction`,
        };
    } catch (err) {
      this.logger.error(
        "Can't update a transaction with id " + id,
        TransactionService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a transaction with id " + id,
      );
    }
  }

  async remove(transaction_id: string) {
    try {
      const result = await this.prismaService.transaction.delete({
        where: {
          id: transaction_id,
        },
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `transaction deleted successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete transaction`,
        };
    } catch (err) {
      this.logger.error(
        "Can't delete a transaction with transaction_id " + transaction_id,
        TransactionService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a transaction with transaction_id " + transaction_id,
      );
    }
  }

  // get all companies
}
