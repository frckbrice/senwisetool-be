import { IsString, IsEmail, Length, IsNotEmpty, IsEnum } from 'class-validator'
import { Role, UserStatus } from '@prisma/client'
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


  /**
 * @example "maebrie2017."
 */
  @IsString()
  @Length(2, 3)
  @IsNotEmpty()
  username: string

  /**
* @example "+237 600001122 or 600001122."
*/
  @IsString()
  @Length(9, 15)
  @IsNotEmpty()
  phone: string;

  /**
  * @example "+237 600001122 or 600001122."
  */
  @IsEnum([UserStatus.AUDITOR, UserStatus.FARMER, UserStatus.EMPLOYEE])
  @Length(9, 15)
  @IsNotEmpty()
  status: UserStatus;
}
