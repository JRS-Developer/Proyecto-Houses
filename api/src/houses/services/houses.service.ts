import { HttpService } from '@nestjs/axios';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { FindManyOptions, Repository } from 'typeorm';
import { CalculateHousePriceDto } from '../dto/calculate-house-price.dto';
import { CreateHouseDto } from '../dto/create-house.dto';
import { UpdateHouseDto } from '../dto/update-house.dto';
import { House } from '../entities/houses.entity';

@Injectable()
export class HousesService {
  constructor(
    @InjectRepository(House)
    private readonly housesReporsitory: Repository<House>,
    private readonly httpService: HttpService,
  ) {}

  async find(options?: FindManyOptions<House>) {
    return await this.housesReporsitory.find(options);
  }

  async create(dto: CreateHouseDto, userId: number) {
    const house = this.housesReporsitory.create(dto);
    house.userId = userId;

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

    const houseToSave = this.housesReporsitory.merge(foundHouse, dto);

    return await this.housesReporsitory.save(houseToSave);
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

  async getPriceCalculation(dto: CalculateHousePriceDto) {
    const { data } = await firstValueFrom(
      this.httpService
        .post<{
          price: number;
        }>('http://localhost:5000/houses/price', dto)
        .pipe(
          catchError((err: AxiosError) => {
            console.error('err ', err.message);

            throw new BadRequestException();
          }),
        ),
    );

    return data;
  }

  async getHouse(houseId: number) {
    const house = await this.housesReporsitory.findOne({
      where: {
        id: houseId,
      },
      relations: { user: true },
      select: {
        user: {
          id: true,
          firstName: true,
          lastName: true,
          image: true,
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
