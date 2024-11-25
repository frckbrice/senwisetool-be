import { Module } from '@nestjs/common';
import { TransactionService } from './transactions.service';
import { TransactionController } from './transactions.controller';
import { MarketsModule } from '../markets/markets.module';

@Module({
  imports: [MarketsModule],
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionsModule { }
