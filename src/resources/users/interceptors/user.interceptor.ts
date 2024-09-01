import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, map } from "rxjs";
import { UserType } from "../entities/user.entity";
import { plainToInstance } from "class-transformer";
import { subscribe } from "diagnostics_channel";


@Injectable()
export class UserInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<UserType[]>): Observable<UserType[]> | Promise<Observable<UserType[]>> {
        //     // remove the password from user response
        const users = next.handle(); // Handle potential Promise return

        // Check if users is an array (add type check if needed)
        if (Array.isArray(users)) {
            return users.pipe(map((users) => [...users].map((user) => plainToInstance(UserType, user))));
        } else {
            // Handle non-array response (log, throw error, etc.)
            console.error('Unexpected response structure. Expected an array of users.');
            return users; // Or return empty array, throw error, etc.
        }
    }
}
