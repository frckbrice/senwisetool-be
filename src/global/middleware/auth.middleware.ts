
import { RequestService } from "src/global/current-logged-in/request.service";

import { Injectable, NestMiddleware, UnauthorizedException, Logger } from '@nestjs/common'
import { NextFunction, Request, Response } from 'express'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
    private allowRoutes = []
    constructor(private readonly requestService: RequestService) { }
    private readonly logger = new Logger(AuthMiddleware.name);

    async use(req: Request, res: Response, next: NextFunction): Promise<void> {
        // allow some routes to be public
        if (
            this.allowRoutes.some((route) => req.originalUrl.startsWith(route))
        )
            return next()

        // handle the authentication
        // const token = this.extractTokenFromHeader(req)
        // if (!token) {
        //     throw new UnauthorizedException()
        // }

        try {/** here we can do the authentication and attach the user to the request */
            const payload = req.body.userId
            this.requestService.setUserId(payload);
        } catch (error) {
            console.error('Authenticification failed', error)
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
    // private extractTokenFromHeader(request: Request): string | undefined {
    //     const [type, token] = request.headers.authorization?.split(' ') ?? []
    //     return type === 'Bearer' ? token : undefined
    // }
}
