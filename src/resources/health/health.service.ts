import { Injectable } from '@nestjs/common';


@Injectable()
export class HealthService {


  findAll() {
    return `The server is running !`;
  }

}
