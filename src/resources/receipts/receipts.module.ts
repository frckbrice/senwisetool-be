import { Module } from '@nestjs/common';
import { ReceiptService } from './receipts.service';
import { ReceiptController } from './receipts.controller';

@Module({
  controllers: [ReceiptController],
  providers: [ReceiptService],
})
export class ReceiptsModule { }
