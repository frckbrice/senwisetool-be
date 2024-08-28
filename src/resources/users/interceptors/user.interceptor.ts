import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { UserType } from "../entities/user.entity";
import { plainToInstance } from "class-transformer";


@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<UserType[]>): Observable<UserType[]> | Promise<Observable<UserType[]>> {
        // remove the password from user response
        return next.handle().pipe(map((users) => users.map((user) => plainToInstance(UserType, user))));

    }
}