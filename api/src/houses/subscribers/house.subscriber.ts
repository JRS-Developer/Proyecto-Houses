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

const getHouseIndex = (house: House): HouseIndex => {
  return {
    id: house.id,
    title: house.title,
    address: house.address,
    salePrice: house.salePrice,
    image: house.image,
    houseStyle: house.houseStyle,
    firePlaces: house.firePlaces,
    garageCars: house.garageCars,
    garageCond: house.garageCond,
    yearBuilt: house.yearBuilt,
    fullBath: house.fullBath,
    bedRoomAbvGr: house.bedRoomAbvGr,
    fireplaceQu: house.fireplaceQu,
    garageArea: house.garageArea,
    utilities: house.utilities,
    poolQC: house.poolQC,
    kitchenAbvGr: house.kitchenAbvGr,
    lotArea: house.lotArea,
    poolArea: house.poolArea,
    garageYrBlt: house.garageYrBlt,
    garageType: house.garageType,
    kitchenQual: house.kitchenQual,
    garageQual: house.garageQual,
    garageFinish: house.garageFinish,
  };
};

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

    const data: HouseIndex = getHouseIndex(house);

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

    const data: HouseIndex = getHouseIndex(house);

    await this.houseSearch.insert(data);
  }
  async beforeRemove(event: RemoveEvent<House>): Promise<void> {
    if (!event.entity) return;
    await this.houseSearch.delete(event.entity.id);
  }
}
