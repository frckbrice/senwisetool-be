import { Module } from '@nestjs/common';
import { ReceiptService } from './receipts.service';
import { ReceiptController } from './receipts.controller';
import { FarmersModule } from '../farmers/farmers.module';

@Module({
  imports: [FarmersModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptsModule { }
