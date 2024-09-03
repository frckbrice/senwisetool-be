
import { RequestService } from "src/global/current-logged-in/request.service";

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient, User } from "@prisma/client";
import { LoggerService } from "src/global/logger/logger.service";
import { UsersService } from "src/resources/users/users.service";
import { PrismaService } from "src/adapters/config/prisma.service";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private allowRoutes = [
        "/v1",
        "/v1/health",
        '/v1/subscriptions/?=subscription_id',
    ]

    constructor(
        private readonly requestService: RequestService,
        private jwtService: JwtService,
        private prismaService: PrismaService
    ) { }
    private readonly logger = new LoggerService(AuthMiddleware.name);

    async use(req: Request & {
        user: Partial<User>
    }, res: Response, next: NextFunction): Promise<void> {

        // allow some routes to be public
        if (this.allowRoutes.includes(req.originalUrl)) {
            this.logger.log('Allowing public  access to route ', AuthMiddleware.name)
            return next()
        }
        this.logger.log('Not allowing public access, start authentication ', AuthMiddleware.name);


        try {
            //handle the authentication 
            const token = this.extractTokenFromHeader(req)


            if (!token) {
                throw new UnauthorizedException("user not authenticated")
            }
            /** here we can do the authentication and attach the user to the request */
            const payload = await this.jwtService.decode(token)
            // console.log("payload ", payload)
            const existingUser = await this.prismaService.user.findUnique({ where: { id: payload.sub }, select: { role: true } }) as User;

            const user: Partial<User> = {
                id: payload.sub,
                email: payload.user_email,
                first_name: payload.user_first_name,
                role: existingUser ? existingUser.role : "ADG"
            };

            req['user'] = user;
            this.requestService.setUserId(payload.sub);
            next()
        } catch (error) {
            this.logger.error(`Authenticification failed \n\n${error}`, AuthMiddleware.name)
            throw new UnauthorizedException('user not authenticated')
        }

    }

    /**
     * Extracts the token fro the request header.
     * 
     * @param {Request} request - the request object
     * @return {string | undefined} the xtracted token  or undefined
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // console.log(" the request headers auth: ", request.headers.authorization);
        // console.log("the request body: ", request.body);
        const [type, token] = request.headers.authorization?.split(' ') ?? []

        return type === 'Bearer' ? token : undefined
    }
}
