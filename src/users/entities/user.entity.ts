import { Exclude } from "class-transformer";
// import { User} '@prisma/client';
// export class Users extends User {

//     @Exclude()
//     password?: string;

// }

export class User {
    id?: string;
    name: string;
    email: string;
    @Exclude()
    password?: string;
    companyId?: string;
}
