
import { RequestService } from "src/global/current-logged-in/request.service";

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from "@prisma/client";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private allowRoutes = [
        "/v1/subscriptions/*",
        "/users/create"
    ]
    constructor(private readonly requestService: RequestService,
        private jwtService: JwtService) { }
    private readonly logger = new Logger(AuthMiddleware.name);

    async use(req: Request & { user: User }, res: Response, next: NextFunction): Promise<void> {

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

        try {
            /** here we can do the authentication and attach the user to the request */
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRETE,
            })
            req['user'] = payload;
            this.requestService.setUserId(payload.sub);
        } catch (error) {
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
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
