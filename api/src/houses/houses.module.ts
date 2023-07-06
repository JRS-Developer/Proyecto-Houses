import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/houses.entity';
import { HousesService } from './services/houses.service';
import { HousesController } from './controllers/houses.controller';
import { SearchModule } from 'src/search/search.module';
import { HousesSearchService } from './services/houses-search.service';
import { HouseSubscriber } from './subscribers/house.subscriber';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([House]), SearchModule, HttpModule],
  providers: [HousesService, HousesSearchService, HouseSubscriber],
  controllers: [HousesController],
})
export class HousesModule {}
