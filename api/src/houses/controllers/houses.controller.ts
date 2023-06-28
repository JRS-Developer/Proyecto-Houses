import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { CalculateHousePriceDto } from '../dto/calculate-house-price.dto';
import { CreateHouseDto } from '../dto/create-house.dto';
import { SearchHousesQueryDto } from '../dto/search-houses.dto';
import { UpdateHouseDto } from '../dto/update-house.dto';
import { House } from '../entities/houses.entity';
import { HousesSearchService } from '../services/houses-search.service';
import { HousesService } from '../services/houses.service';

@Controller('houses')
export class HousesController {
  constructor(
    private readonly housesService: HousesService,
    private readonly housesSearchService: HousesSearchService,
  ) {}

  @Auth()
  @Get('/')
  async getHouses(@GetUser('id') userId: number) {
    return this.housesService.getUserHouses(userId);
  }

  @Auth()
  @Post('/')
  async createHouse(
    @GetUser('id') userId: number,
    @Body() body: CreateHouseDto,
  ) {
    const res = await this.housesService.create(body, userId);

    return {
      message: 'House created successfully',
      statusCode: HttpStatus.CREATED,
      data: res,
    };
  }

  @Auth()
  @Post('/calculate-price')
  async calculateHousePrice(@Body() body: CalculateHousePriceDto) {
    // TODO: calculate house price
  }

  @Get('/search')
  async searchHouses(@Query() query: SearchHousesQueryDto) {
    const data = await this.housesSearchService.paginate(query);

    return {
      data: data?.body?.hits?.hits?.map((h) => h?._source),
    };
  }

  @Auth()
  @Get('/:id')
  async getHouse(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) houseId: number,
  ) {
    return this.housesService.getUserHouse(userId, houseId);
  }

  @Auth()
  @Put('/:id')
  async updateHouse(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) houseId: number,
    @Body() body: UpdateHouseDto,
  ) {
    const res = await this.housesService.update(houseId, userId, body);
    const copy: Partial<House> = res;
    delete copy.user;

    return {
      message: 'House updated successfully',
      statusCode: HttpStatus.OK,
      data: res,
    };
  }

  @Auth()
  @Delete('/:id')
  async deleteHouse(
    @GetUser('id') userId: number,
    @Param('id', ParseIntPipe) houseId: number,
  ) {
    await this.housesService.deleteUserHouse(userId, houseId);

    return {
      message: 'House deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
