
import { RequestService } from "src/global/current-logged-in/request.service";

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from "@prisma/client";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private allowRoutes = [
        '/v1/subscriptions/?=subscription_id',
        "/users",
    ]

    constructor(private readonly requestService: RequestService,
        private jwtService: JwtService) { }
    private readonly logger = new Logger(AuthMiddleware.name);

    async use(req: Request & {
        user: {
            user_id: string,
            user_email: string,
            first_name: string,
        }
    }, res: Response, next: NextFunction): Promise<void> {

        // allow some routes to be public
        if (this.allowRoutes.includes(req.originalUrl)) {
            this.logger.log('Allowing public access', AuthMiddleware.name)
            return next()
        }
        this.logger.log('Not allowing public access. start authentication', AuthMiddleware.name)
        //handle the authentication
        const token = this.extractTokenFromHeader(req)
        if (!token) {
            throw new UnauthorizedException("user not authenticated")
        }
        // console.log("token: ", token)
        try {
            /** here we can do the authentication and attach the user to the request */
            const payload = await this.jwtService.decode(token)
            const user = {
                user_id: payload.sub,
                user_email: payload.user_email,
                first_name: payload.user_first_name,
            }
            req['user'] = user; // either use req.user = user or req.body = user
            req.body = user
            this.requestService.setUserId(payload.sub);
        } catch (error) {
            console.error("Error ", error)
            this.logger.error('Authenticification failed', AuthMiddleware.name)
            throw new UnauthorizedException('user not authenticated')
        }
        next()
    }

    /**
     * Extracts the token from the request header.
     *
     * @param {Request} request - the request object
     * @return {string | undefined} the extracted token or undefined
     */
    private extractTokenFromHeader(request: Request): string | undefined {
        // console.log(" the request: ", request.headers.authorization)
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
