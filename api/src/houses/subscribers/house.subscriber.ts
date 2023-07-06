import { Injectable } from '@nestjs/common';
import {
  DataSource,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  RemoveEvent,
  UpdateEvent,
} from 'typeorm';
import { House } from '../entities/houses.entity';
import { HouseIndex } from '../indexes/house.index';
import { HousesSearchService } from '../services/houses-search.service';

@EventSubscriber()
@Injectable()
export class HouseSubscriber implements EntitySubscriberInterface<House> {
  constructor(
    dataSource: DataSource,
    private readonly houseSearch: HousesSearchService,
  ) {
    dataSource.subscribers.push(this);
  }

  listenTo() {
    return House;
  }

  async afterInsert(event: InsertEvent<House>) {
    const entity = event.entity;
    const house = await event.manager.getRepository(House).findOne({
      where: {
        id: entity.id,
      },
    });

    if (!house) return;

    const data: HouseIndex = {
      id: house.id,
      title: house.title,
      salePrice: house.salePrice,
      houseStyle: house.houseStyle,
      firePlaces: house.firePlaces,
      garageCars: house.garageCars,
      garageCond: house.garageCond,
      yearBuilt: house.yearBuilt,
    };

    await this.houseSearch.insert(data);
  }

  async afterUpdate(event: UpdateEvent<any>) {
    const entity = event.entity;
    if (!entity?.id) return;

    const house = await event.manager.getRepository(House).findOne({
      where: {
        id: entity.id,
      },
    });

    if (!house) return;

    const data: HouseIndex = {
      id: house.id,
      title: house.title,
      salePrice: house.salePrice,
      houseStyle: house.houseStyle,
      firePlaces: house.firePlaces,
      garageCars: house.garageCars,
      garageCond: house.garageCond,
      yearBuilt: house.yearBuilt,
    };

    await this.houseSearch.insert(data);
  }
  async beforeRemove(event: RemoveEvent<House>): Promise<void> {
    if (!event.entity) return;
    await this.houseSearch.delete(event.entity.id);
  }
}
