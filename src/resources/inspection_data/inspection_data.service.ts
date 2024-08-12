import { Injectable } from '@nestjs/common';
import { CreateInspectionDatumDto } from './dto/create-inspection_datum.dto';
import { UpdateInspectionDatumDto } from './dto/update-inspection_datum.dto';

@Injectable()
export class InspectionDataService {
  create(createInspectionDatumDto: CreateInspectionDatumDto) {
    return 'This action adds a new inspectionDatum';
  }

  findAll() {
    return `This action returns all inspectionData`;
  }

  findOne(id: number) {
    return `This action returns a #${id} inspectionDatum`;
  }

  update(id: number, updateInspectionDatumDto: UpdateInspectionDatumDto) {
    return `This action updates a #${id} inspectionDatum`;
  }

  remove(id: number) {
    return `This action removes a #${id} inspectionDatum`;
  }
}
