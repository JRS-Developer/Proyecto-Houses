import { Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { HousesModule } from './houses/houses.module';
import * as Joi from 'joi';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { join } from 'path';
import { DataSource } from 'typeorm';
import { faker } from '@faker-js/faker';
import { House } from './houses/entities/houses.entity';
import { User } from './users/entities/users.entity';
// import { passwordHashEncrypt } from './auth/helpers/password-encrypt';
import { chunk } from 'lodash';
import { SearchModule } from './search/search.module';
import { HousesSearchService } from './houses/services/houses-search.service';
import { EventsModule } from './events/events.module';
import { ChatsModule } from './chats/chats.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        database: configService.get('DB_NAME'),
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_NAME: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
      }),
    }),
    AuthModule,
    UsersModule,
    HousesModule,
    SearchModule,
    EventsModule,
    ChatsModule,
  ],
  controllers: [],
  providers: [HousesSearchService],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    private readonly houseSearchService: HousesSearchService,
  ) {}

  async onModuleInit() {
    const results: {
      Id: string;

      SalePrice: number;

      LotArea: string;

      HouseStyle: string;

      Neighborhood: string;

      FirePlaces: string;
      FireplaceQu: string;

      GarageCars: string;
      GarageCond: string;
      GarageArea: string;
      GarageYrBlt: string;
      GarageType: string;
      GarageFinish: string;
      GarageQual: string;

      KitchenQual: string;
      KitchenAbvGr: string;

      BedroomAbvGr: string;

      FullBath: string;

      PoolArea: string;
      PoolQC: string;

      Heating: string;

      Utilities: string;

      YearBuilt: string;

      RoofStyle: string;
      RoofMatl: string;
    }[] = [];
    const houseRepository = this.dataSource.getRepository(House);

    // Guarda las casas y generaa usuarios falsos
    // si no hay data
    const count = await houseRepository.count();
    // count = 0;

    if (!count) {
      const userRepo = this.dataSource.getRepository(User);

      await userRepo.delete({});
      await houseRepository.clear();

      fs.createReadStream(join(__dirname, '..', 'train.csv'))
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          function avoidNA<T>(value: T) {
            if (value === 'NA') {
              return null as T;
            }
            return value;
          }

          const createdHouses: House[] = await houseRepository.save(
            results.map((r) => {
              const address = faker.location.streetAddress();
              return {
                id: Number(r.Id),
                image: faker.image.urlLoremFlickr({
                  category: 'house',
                  height: 480,
                  width: 640,
                }),
                houseStyle: avoidNA(r.HouseStyle),
                salePrice: Number(r.SalePrice),

                firePlaces: Number(r.FirePlaces ?? 0),
                fireplaceQu: avoidNA(r.FireplaceQu),

                garageCars: Number(avoidNA(r.GarageCars) ?? 0),
                garageCond: avoidNA(r.GarageCond),
                garageYrBlt: Number(avoidNA(r.GarageYrBlt) ?? 0),
                garageArea: Number(avoidNA(r.GarageArea) ?? 0),
                garageType: avoidNA(r.GarageType),
                garageFinish: avoidNA(r.GarageFinish),
                garageQual: avoidNA(r.GarageQual),

                poolArea: Number(avoidNA(r.PoolArea) ?? 0),
                poolQC: avoidNA(r.PoolQC),

                lotArea: Number(avoidNA(r.LotArea) ?? 0),

                kitchenAbvGr: Number(avoidNA(r.KitchenAbvGr) ?? 0),
                kitchenQual: avoidNA(r.KitchenQual),

                bedRoomAbvGr: Number(avoidNA(r.BedroomAbvGr) ?? 0),

                fullBath: Number(avoidNA(r.FullBath) ?? 0),

                utilities: avoidNA(r.Utilities),

                // A title for a house in sale indicating the address
                title: `House at ${[
                  address,
                  Number(r.GarageCars ?? 0)
                    ? `with ${r.GarageCars} car garage`
                    : '',
                  `built in ${r.YearBuilt}`,
                ]
                  .filter(Boolean)
                  .join(', ')}`,
                address,
                yearBuilt: Number(r.YearBuilt),
                user: null,
              } satisfies House;
            }),
          );

          const users: User[] = [];
          const chunkHouses = chunk(createdHouses, 5);

          for await (const chuncked of chunkHouses) {
            const user = new User();
            user.email = faker.internet.email();
            // user.password = await passwordHashEncrypt('password');
            user.password = 'password';
            user.houses = chuncked;
            user.firstName = faker.person.firstName();
            user.lastName = faker.person.lastName();
            user.image = faker.image.urlLoremFlickr({
              category: 'people',
              height: 480,
              width: 640,
            });

            users.push(user);
          }

          console.log('createdHouses', createdHouses.length);
          console.log('users', users.length);

          await houseRepository.save(createdHouses);
          await userRepo.save(users);
        });
    }

    await this.houseSearchService.sync();
  }
}
