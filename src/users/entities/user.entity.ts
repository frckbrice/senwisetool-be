import { Exclude } from "class-transformer";

export class User {

    name: string;
    email: string;
    @Exclude()
    password?: string;
}
