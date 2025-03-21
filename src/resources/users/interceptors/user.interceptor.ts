import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';
import { UserType } from '../entities/user.entity';
import { plainToInstance } from 'class-transformer';
import { LoggerService } from 'src/global/logger/logger.service';
import { ReturnType } from 'src/global/utils/return-type';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  private logger = new LoggerService(UserInterceptor.name);
  intercept(
    context: ExecutionContext,
    next: CallHandler<ReturnType<UserType>>,
  ) {
    //  call the target handler function and return the result;
    const users = next.handle();

    return users.pipe(
      map(({ data, ...rest }) =>
        rest.total
          ? {
              status: rest.status,
              message: rest.message,
              data: plainToInstance(UserType, data),
              total: rest.total,
              page: rest.page,
              perPage: rest.perPage,
              totalPages: rest.totalPages,
            }
          : {
              status: rest.status,
              message: rest.message,
              data: plainToInstance(UserType, data),
            },
      ),
    );
  }
}
