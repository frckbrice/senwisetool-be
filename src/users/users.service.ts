import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    return "This action adds a new user";
  }

  findAll() {
    return [{
      name: "paul",
      email: "paul@me.com",
      password: "password"
    }, {
      name: "Henry",
      email: "henry@me.com",
      password: "henry"
    }, {
      name: "Golang",
      email: "golang@me.com",
      password: "Golang"
    }];;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
