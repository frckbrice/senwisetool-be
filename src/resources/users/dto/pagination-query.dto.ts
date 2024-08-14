import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";
import { Role } from "@prisma/client";

export class PaginationQueryDto<TData = User> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit?: number = 40 // number of users to query at a time. defaults to 40;

  @ApiProperty()
  skip?: number = 0 // number of users to skip;

  @ApiProperty()
  role?: Role = Role.ADG

  @ApiProperty()
  results: TData[];
}