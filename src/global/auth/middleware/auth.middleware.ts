import { RequestService } from 'src/global/current-logged-in/request.service';

import {
    HttpException,
    HttpStatus,
    Injectable,
    NestMiddleware,
    UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { LoggerService } from 'src/global/logger/logger.service';
import { PrismaService } from 'src/adapters/config/prisma.service';
import { UserType } from 'src/resources/users/entities/user.entity';
import { UsersService } from 'src/resources/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private allowGetRoutes = ['/v1', '/v1/health'];

    private allowPostRoutes = [
        '/v1/companies',
        '/v1/subscriptions/successPayPalPayment/?subscription_id',
    ];

    constructor(
        private readonly requestService: RequestService,
        private jwtService: JwtService,
        private prismaService: PrismaService,
    ) { }
    private readonly logger = new LoggerService(AuthMiddleware.name);

    async use(
        req: Request & {
            user: Partial<User>;
        },
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (req.method == 'GET' && this.allowGetRoutes.includes(req.originalUrl)) {
            console.log("method : ",req.method )
            console.log("url: ", req.originalUrl)
            console
            this.logger.log('Allowing public  access to route  for method' + req.method , AuthMiddleware.name);
            return next();
        } 
        if (
            req.method == 'POST' &&
            this.allowPostRoutes.includes(req.originalUrl)
        ) {
                        console.log("method : ",req.method )
            console.log("url: ", req.originalUrl)
            // allow some routes to be public
            this.logger.log('Allowing public  access to route for method'+req.method , AuthMiddleware.name);
            return next();
        }
            console.log("method : ",req.method )
            console.log("url: ", req.originalUrl)
        this.logger.log(
            'Not allowing public access, start authentication ',
            AuthMiddleware.name,
        );

        try {
            //get the token frm the req.
            const token = this.extractTokenFromHeader(req);

            if (!token) {
                throw new UnauthorizedException('user not authenticated');
            }
            /** here we can do the authentication and attach the user to the request */
            const payload = await this.jwtService.decode(token);
            console.log('user payload ', payload);
            const existingUser = <User>await this.prismaService.user.findUnique({
                where: { id: payload.sub },
                select: {
                    role: true,
                    id: true,
                    email: true,
                    company_id: true,
                    first_name: true,
                },
            });

            console.log('existing user ', existingUser);
            let user: Partial<User>;
            if (payload) {
                let userRole: Role = Role.ADG;
                if (payload.org_role) userRole = Role.PDG;

                user = {
                    id: existingUser.id ?? payload.sub,
                    email: existingUser.email ?? payload.user_email,
                    first_name: existingUser.first_name ?? payload.user_first_name,
                    role: existingUser.role ?? userRole,
                    company_id: existingUser.company_id,
                };
                req['user'] = user;
                this.requestService.setUserId(payload.sub);
                next();
            } else
                throw new HttpException(
                    'Unprocessable entity',
                    HttpStatus.UNPROCESSABLE_ENTITY,
                );
        } catch (error) {
            this.logger.error(
                `Authenticification failed \n\n${error}`,
                AuthMiddleware.name,
            );
            throw new UnauthorizedException('user not authenticated');
        }
    }

    /**
     * Extracts the token fro the request header.
     *
     * @param {Request} request - the request object
     * @return {string | undefined} the xtracted token  or undefined
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // console.log(" the request   headers auth: ", request.headers.authorization);
        // console.log("the request body: ", request.body);
        const [type, token] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}
