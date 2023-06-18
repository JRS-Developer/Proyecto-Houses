import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { House } from '../entities/houses.entity';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly housesReporsitory: Repository<House>,
  ) {}

  async find(options?: FindManyOptions<House>) {
    return await this.housesReporsitory.find(options);
  }
}
