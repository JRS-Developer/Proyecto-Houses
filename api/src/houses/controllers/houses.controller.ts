import { Controller, Get } from '@nestjs/common';
import { HousesService } from '../services/houses.service';

@Controller('houses')
export class HousesController {
  constructor(private readonly housesService: HousesService) {}

  @Get('/')
  async getHouses() {
    return this.housesService.find();
  }
}
