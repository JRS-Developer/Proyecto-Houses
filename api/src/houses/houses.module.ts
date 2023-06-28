import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/houses.entity';
import { HousesService } from './services/houses.service';
import { HousesController } from './controllers/houses.controller';
import { SearchModule } from 'src/search/search.module';
import { HousesSearchService } from './services/houses-search.service';
import { HouseSubscriber } from './subscribers/house.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([House]), SearchModule],
  providers: [HousesService, HousesSearchService, HouseSubscriber],
  controllers: [HousesController],
})
export class HousesModule {}
