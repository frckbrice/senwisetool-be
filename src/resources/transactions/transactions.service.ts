import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, Transaction, User } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { UsersService } from '../users/users.service';
import { Slugify } from 'src/global/utils/slugilfy';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MarketsService } from '../markets/markets.service';

@Injectable()
export class TransactionService {
  private readonly logger = new LoggerService(TransactionService.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly marketService: MarketsService,
  ) { }


  async create(
    createTransactionDto: Prisma.TransactionCreateInput & {
      market_number: string;
    },
  ) {
    // if no market number denied the create transaction
    if (!createTransactionDto.market_number)
      throw new HttpException(`Market number is required`, HttpStatus.BAD_REQUEST);

    // avoid creating transaction twice
    console.log('\n\n transaction payload: ', createTransactionDto);
    try {

      const result = await this.prismaService.transaction.create({
        data: createTransactionDto as Prisma.TransactionCreateInput,
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
    const where: any = {
      ... (market_id && { market_id })
    };

    let Query = {
      where,
      take: perPage ?? 20 - 1,
      skip: (page ?? 0) * (perPage ?? 20 - 1),
      orderBy: {
        created_at: 'desc' as const,
      },
    };
    // find all the companies
    try {
      const [total, transactions] = await this.prismaService.$transaction([
        this.prismaService.transaction.count(where),
        this.prismaService.transaction.findMany(Query),
      ]);
      if (transactions.length)
        return {
          status: 200,
          message: 'transactions fetched successfully',
          data: transactions,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (query.perPage ?? 20 - 1)),
        };
      else
        return {
          status: 400,
          message: 'No transactions found',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20 - 1,
          totalPages: Math.ceil(total / (query.perPage ?? 20 - 1)),
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

  async update(id: string, updateTransactionDto: Prisma.TransactionUpdateInput & {
    market_number: string
  }) {
    try {
      console.log("\n\n incoming transaction: ", updateTransactionDto);
      let result: Transaction;
      // check the existence of the transaction
      if (updateTransactionDto?.market_number) {
        const existingT = await this.marketService.findOne(updateTransactionDto?.market_number);
        if (!existingT)
          throw new HttpException(`There is No existing transaction with that Id `, HttpStatus.BAD_REQUEST);

        // check if this transaction correspond to existing market
        const existingTransMarket = await this.prismaService.transaction.findUnique({
          where: {
            market_number: id, // id here comes from mobile and its market_number.
          }
        });

        if (!existingTransMarket)
          throw new HttpException(`There is No existing transaction with that Id `, HttpStatus.BAD_REQUEST);

        const { market_number, ...rest } = updateTransactionDto;

        result = await this.prismaService.transaction.update({
          data: rest as Prisma.TransactionUpdateInput,
          where: {
            market_number,
          },
        });

        // we update the market object in DB with the product quantity
        if (result) {
          await this.marketService.update({
            id: result?.market_number,
            updateMarketDto: { product_quantity: result?.number_of_bags },
          });
        }

      } else {
        result = await this.prismaService.transaction.update({
          data: updateTransactionDto as Prisma.TransactionUpdateInput,
          where: {
            id,
          },
        });
      }

      if (result)
        return {
          data: result,
          status: 201,
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
        `Can't update a transaction with id  + id,
       \n\n ${err}
      `, TransactionService.name);
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
