import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class PaginationQueryDto<TData = User> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  limit?: number = 40 // number of users to query at a time. defaults to 40;

  @ApiProperty()
  skip?: number = 0 // number of users to skip;

  results: TData[];
}