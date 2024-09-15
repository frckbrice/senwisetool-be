import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateInspectionDatumDto } from './dto/create-inspection_datum.dto';
import { UpdateInspectionDatumDto } from './dto/update-inspection_datum.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { LoggerService } from 'src/global/logger/logger.service';

@Injectable()
export class InspectionDataService {
  private readonly logger = new LoggerService(InspectionDataService.name);

  constructor(private readonly prismaService: PrismaService) {}
  async create(createInspectionDatumDto: Prisma.Inspection_dataCreateInput) {
    return this.prismaService.inspection_data.create({
      data: createInspectionDatumDto,
    });
  }

  //TODO: create pagination for inspection_data resource
  async findAll(query: { projectId: string; page?: number; perPage?: number }) {
    try {
      if (query.projectId) {
        const [total, inspectionData] = await this.prismaService.$transaction([
          this.prismaService.inspection_data.count({}),
          this.prismaService.inspection_data.findMany({
            where: {
              project_id: query.projectId,
            },
            take: query.page,
            skip: (query.page ?? 0) * (query.perPage ?? 20 - 1),
            orderBy: {
              created_at: 'desc',
            },
          }),
        ]);
        return {
          total,
          data: inspectionData,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      }
      //TODO: return right object here
      return this.prismaService.inspection_data.findMany({});
    } catch (error) {
      this.logger.error(
        'can find all the inspection data',
        InspectionDataService.name,
      );
      throw new NotFoundException('can find all the inspection data');
    }
  }

  async findOne(id: string) {
    return this.prismaService.inspection_data
      .findUnique({
        where: {
          id,
        },
      })
      .catch((err) => {
        this.logger.error(
          "Can't find a inspection project data with id " + id,
          InspectionDataService.name,
        );
        throw new NotFoundException("Can't find a projec data with id " + id);
      });
  }

  async update(
    id: string,
    updateInspectionDatumDto: Prisma.Inspection_dataUpdateInput,
  ) {
    return this.prismaService.inspection_data
      .update({
        where: {
          id,
        },
        data: updateInspectionDatumDto,
      })
      .catch((err) => {
        this.logger.error(
          "Can't update a inspection project data with id " + id,
          InspectionDataService.name,
        );
        throw new NotFoundException(
          "Can't update a inspection project with id " + id,
        );
      });
  }

  async remove(id: string) {
    return this.prismaService.project
      .delete({
        where: {
          id,
        },
      })
      .catch((err) => {
        this.logger.error(
          "Can't delete a project with id " + id,
          InspectionDataService.name,
        );
        throw new InternalServerErrorException(
          "Can't delete a project with id " + id,
        );
      });
  }
}
