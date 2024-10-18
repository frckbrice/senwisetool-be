import { Module } from '@nestjs/common';
import { InspectionDataService } from './inspection_data.service';
import { InspectionDataController } from './inspection_data.controller';
import { FieldWorkerHost } from './worker-host';

@Module({
  controllers: [InspectionDataController],
  providers: [
    InspectionDataService,
    FieldWorkerHost
  ],
})
export class InspectionDataModule { }
