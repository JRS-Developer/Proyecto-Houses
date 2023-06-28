import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { CreateHouseDto } from '../dto/create-house.dto';
import { UpdateHouseDto } from '../dto/update-house.dto';
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

  async create(dto: CreateHouseDto, userId: number) {
    const house = new House();
    house.title = dto.title;
    house.salePrice = dto.salePrice;
    house.userId = userId;
    house.yearBuilt = dto.yearBuilt;
    house.garageCars = dto.garageCars;

    return await this.housesReporsitory.save(house);
  }

  async update(id: number, userId: number, dto: UpdateHouseDto) {
    const foundHouse = await this.housesReporsitory.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!foundHouse) {
      throw new NotFoundException('House not found');
    }

    if (dto.title) {
      foundHouse.title = dto.title;
    }

    if (dto.salePrice) {
      foundHouse.salePrice = dto.salePrice;
    }

    if (dto.yearBuilt) {
      foundHouse.yearBuilt = dto.yearBuilt;
    }

    if (dto.garageCars !== undefined) {
      foundHouse.garageCars = dto.garageCars;
    }

    return await this.housesReporsitory.save(foundHouse);
  }

  async getUserHouses(userId: number) {
    return await this.housesReporsitory.find({
      where: {
        user: {
          id: userId,
        },
      },
    });
  }

  async getUserHouse(userId: number, houseId: number) {
    const house = await this.housesReporsitory.findOne({
      where: {
        id: houseId,
        user: {
          id: userId,
        },
      },
    });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    return house;
  }

  async deleteUserHouse(userId: number, houseId: number) {
    const house = await this.housesReporsitory.findOne({
      where: {
        id: houseId,
        user: {
          id: userId,
        },
      },
    });

    if (!house) {
      throw new NotFoundException('House not found');
    }

    return await this.housesReporsitory.remove(house);
  }
}
