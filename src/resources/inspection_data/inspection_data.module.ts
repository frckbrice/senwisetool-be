import { Module } from '@nestjs/common';
import { InspectionDataService } from './inspection_data.service';
import { InspectionDataController } from './inspection_data.controller';
import { FieldWorkerHost } from './worker-host';
import { FarmWorkerHost } from './worker-host-farm';

@Module({
  controllers: [InspectionDataController],
  providers: [
    InspectionDataService,
    FieldWorkerHost,
    FarmWorkerHost
  ],
})
export class InspectionDataModule { }
