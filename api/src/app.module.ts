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
import { passwordHashEncrypt } from './auth/helpers/password-encrypt';
import { chunk } from 'lodash';
import { SearchModule } from './search/search.module';
import { HousesSearchService } from './houses/services/houses-search.service';

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
      HouseStyle: string;
      Neighborhood: string;
      FirePlaces: string;
      GarageCars: string;
      GarageCond: string;
      GarageArea: string;
      GarageYrBlt: string;
      Heating: string;

      Utilities: string;
      YearBuilt: string;
      RoofStyle: string;
      RoofMatl: string;
    }[] = [];
    const houseRepository = this.dataSource.getRepository(House);

    // Guarda las casas y generaa usuarios falsos
    // si no hay data
    if (!(await houseRepository.count())) {
      const userRepo = this.dataSource.getRepository(User);

      await userRepo.delete({});
      await houseRepository.clear();

      fs.createReadStream(join(__dirname, '..', 'train.csv'))
        .pipe(csv())
        .on('data', (data) => {
          results.push(data);
        })
        .on('end', async () => {
          const createdHouses: House[] = await houseRepository.save(
            results.map(
              (r) =>
                ({
                  id: Number(r.Id),
                  firePlaces: Number(r.FirePlaces ?? 0),
                  garageCars: Number(r.GarageCars ?? 0),
                  garageCond: r.GarageCond,
                  houseStyle: r.HouseStyle,
                  salePrice: Number(r.SalePrice),
                  // A title for a house in sale indicating the address
                  title: `House at ${[
                    faker.location.streetAddress(),
                    Number(r.GarageCars ?? 0)
                      ? `with ${r.GarageCars} car garage`
                      : '',
                    `built in ${r.YearBuilt}`,
                  ]
                    .filter(Boolean)
                    .join(', ')}`,
                  yearBuilt: Number(r.YearBuilt),
                  user: null,
                } satisfies House),
            ),
          );

          const users: User[] = [];
          const chunkHouses = chunk(createdHouses, 5);
          for await (const chuncked of chunkHouses) {
            const user = new User();
            user.email = faker.internet.email();
            user.password = await passwordHashEncrypt('password');
            user.houses = chuncked;

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
