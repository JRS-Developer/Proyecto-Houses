import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { House } from './entities/houses.entity';
import { HousesService } from './services/houses.service';
import { HousesController } from './controllers/houses.controller';

@Module({
  imports: [TypeOrmModule.forFeature([House])],
  providers: [HousesService],
  controllers: [HousesController],
})
export class HousesModule {}
