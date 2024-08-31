import { IsString, IsEmail, Length, IsNotEmpty, IsEnum } from 'class-validator'
import { Role, User, UserStatus } from '@prisma/client'
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
  company_id: string


  /**
* @example "+237 600001122 or 600001122."
*/
  @IsString()
  phone_number: string


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
  @IsEnum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BANNED])
  @Length(9, 15)
  @IsNotEmpty()
  status: UserStatus;

  /**
   * example company_1:1526654ds4ds5ds55
   */

  /**
   * example https://*
   */
  famer_attached_contract_url: string | null

  /**
   *  example first_name: John
   *  */
  first_name: string

  /**
   * example last_name: doe
   */
  last_name: string | null

  /**
   * example phone_number: +237 600001122
   */

  /**
   * example profile_urls: https://*
   */
  profileUrls: string | null

  /**
   * example id: 9e6b3782-3c6f-4961-a986-48372f88a154
   */
  id: string

  /**
   * example updated_at: 2022-06-01
   */
  updated_at: Date

  /**
   * example created_at: 2022-06-01
   */
  created_at: Date
}
