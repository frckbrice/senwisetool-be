import { Injectable, Scope } from "@nestjs/common";


// this makes the service available to all requests. 
// and the service is singleton/unique.This is request safe.
@Injectable({ scope: Scope.REQUEST })
export class RequestService {
    private userId: string;

    getUserId() {
        return this.userId;
    }

    setUserId(userId: string) {
        this.userId = userId;
    }
}