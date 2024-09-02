import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) { }


  @Get()
  findAll() {
    return `server running at ${this.healthService.findAll()}`;
  }

}
