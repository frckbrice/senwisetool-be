import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { User } from "../entities/user.entity";
import { plainToInstance } from "class-transformer";


@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<User[]>): Observable<User[]> | Promise<Observable<User[]>> {
        // remove the password from user response
        return next.handle().pipe(map((users) => users.map((user) => plainToInstance(User, user))));

    }
}