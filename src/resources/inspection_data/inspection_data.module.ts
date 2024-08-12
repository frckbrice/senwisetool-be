import { Module } from '@nestjs/common';
import { InspectionDataService } from './inspection_data.service';
import { InspectionDataController } from './inspection_data.controller';

@Module({
  controllers: [InspectionDataController],
  providers: [InspectionDataService],
})
export class InspectionDataModule {}
