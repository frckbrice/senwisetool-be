import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { Prisma, User } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { RolesGuard } from 'src/global/auth/guards/auth.guard';
import { UsersService } from '../users/users.service';
import { Slugify } from 'src/global/utils/slugilfy';
import { PaginationTrainingSessionQueryDto } from './dto/paginate-training_session.dto';

@Injectable()
export class TrainingSessionService {
  private readonly logger = new LoggerService(TrainingSessionService.name);

  constructor(private readonly prismaService: PrismaService) {}

  async create(createTrainingSessionDto: Prisma.training_sessionCreateInput) {
    try {
      const result = await this.prismaService.training_session.create({
        data: {
          ...createTrainingSessionDto,
        },
      });

      if (result)
        return {
          data: result,
          status: 201,
          message: `training_session created successfully`,
        };
      else
        return {
          data: null,
          status: 500,
          message: `Failed to create training_session`,
        };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientValidationError) {
        this.logger.error(
          `Error while creating training_session ${error.name}: Validation error \n\n ${error}`,
          TrainingSessionService.name,
        );
        throw new InternalServerErrorException(
          `Validation Error while creating training_session ` +
            createTrainingSessionDto.id,
        );
      }
      this.logger.error(
        `Error while creating training_session ${createTrainingSessionDto.id} \n\n ${error}`,
        TrainingSessionService.name,
      );
      throw new InternalServerErrorException(
        `Error while creating training_session ` + TrainingSessionService.name,
      );
    }
  }

  async findAll(query: Partial<PaginationTrainingSessionQueryDto>) {
    // find all the training with the latest start date with its status and type
    const { page, perPage } = query;
    let Query = Object.create({});
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
      const [total, training_sessions] = await this.prismaService.$transaction([
        this.prismaService.training_session.count(),
        this.prismaService.training_session.findMany(Query),
      ]);
      if (training_sessions.length)
        return {
          status: 200,
          message: 'training_sessions fetched successfully',
          data: training_sessions,
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
      else
        return {
          status: 400,
          message: 'No training_sessions found',
          data: [],
          total,
          page: query.page ?? 0,
          perPage: query.perPage ?? 20,
          totalPages: Math.ceil(total / (query.perPage ?? 20)),
        };
    } catch (error) {
      this.logger.error(
        `Error fetching training_sessions \n\n ${error}`,
        TrainingSessionService.name,
      );
      throw new NotFoundException('Error fetching training_sessions');
    }
  }

  async findOne(session_id: string) {
    try {
      const result = await this.prismaService.training_session.findUnique({
        where: {
          id: session_id,
        },
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `training fetched successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to fetch training`,
        };
    } catch (err) {
      this.logger.error(
        `Can't find a training with title: ${session_id} \n\n ${err}`,
        TrainingSessionService.name,
      );
      throw new NotFoundException(
        "Can't find a training with id " + session_id,
      );
    }
  }

  async update(
    session_id: string,
    updateTrainingDto: Prisma.training_sessionUpdateInput,
  ) {
    try {
      const result = await this.prismaService.training_session.update({
        data: updateTrainingDto,
        where: {
          id: session_id,
        },
      });

      if (result)
        return {
          data: result,
          status: 204,
          message: `training_session updated successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to update training_session`,
        };
    } catch (err) {
      this.logger.error(
        `Can't update a training_session  with id ${session_id} \n\n ${err} `,
        TrainingSessionService.name,
      );
      throw new InternalServerErrorException(
        "Can't update a training_session with session_id " + session_id,
      );
    }
  }

  async remove(session_id: string) {
    try {
      const result = await this.prismaService.training_session.delete({
        where: {
          id: session_id,
        },
      });

      if (result)
        return {
          data: result,
          status: 200,
          message: `training_session deleted successfully`,
        };
      else
        return {
          data: null,
          status: 400,
          message: `Failed to delete training_session`,
        };
    } catch (err) {
      this.logger.error(
        `Can't delete a training_session with session_id ${session_id} \n\n ${err}`,
        TrainingSessionService.name,
      );
      throw new InternalServerErrorException(
        "Can't delete a training_session with session_id " + session_id,
      );
    }
  }
}
