import { IsString, IsEmail, Length, IsNotEmpty } from 'class-validator'
import { Role } from '@prisma/client'
import { UUID } from 'crypto'
export class CreateUserDto {
    /**
      * @example "John@description.com"
    */
    @IsEmail()
    @IsNotEmpty()
    email: string

    /**
     * @example "John123654DFDFDFDFAaashi"
     */
    @IsString()
    @Length(6, 10)
    @IsNotEmpty()
    password: string

    /**
    * @example "doe"
    */
    @IsString()
    @IsNotEmpty()
    firstName: string

    /**
    * @example "John"
    */
    @IsString()
    @IsNotEmpty()
    lastName: string

    /**
    * @example "ADG"
    */
    @IsString()
    role: Role


    /**
    * @example "9e6b3782-3c6f-4961-a986-48372f88a154"
    */
    @IsString()
    @IsNotEmpty()
    companyId: string

    /**
      * @example "123456789"
      */
    @IsString()
    phoneNumber: string

    /**
   * @example "Mr."
   */
    @IsString()
    @Length(2, 3)
    civility: string
}
