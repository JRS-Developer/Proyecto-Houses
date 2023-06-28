import { Injectable } from '@nestjs/common';
import { Fields } from '@opensearch-project/opensearch/api/types';
import { SearchService } from 'src/search/services/search.service';
import { DataSource } from 'typeorm';
import { SearchHousesQueryDto } from '../dto/search-houses.dto';
import { House } from '../entities/houses.entity';
import { HouseIndex } from '../indexes/house.index';

@Injectable()
export class HousesSearchService {
  constructor(
    private readonly searchService: SearchService<HouseIndex>,
    private readonly dataSource: DataSource,
  ) {}

  private readonly index = 'houses';

  async sync() {
    console.log('HouseSearchService: sync');
    try {
      // Prepare opensearch indeces
      const exists = await this.searchService.existsIndex({
        index: this.index,
      });

      console.log('HouseSearchService: indexExists', exists?.body);

      if (exists?.body === false) {
        const response = await this.searchService.createIndex({
          index: this.index,
        });
        console.log(response);
      }

      const data = await this.searchService.countIndex({
        index: this.index,
      });
      const total: number = data?.body.count ?? 0;
      const dbDataCount: number = await this.dataSource.manager.count(House);

      console.log('HouseSearchService: total', total);

      console.log('HouseSearchService: dbTotal', dbDataCount);

      if (!total || dbDataCount > total) {
        const houses = await this.dataSource.getRepository(House).find();

        await this.insert(houses);
      }

      const newTotal = await this.searchService.countIndex({
        index: this.index,
      });
      console.log('HouseSearchService: newTotal', newTotal?.body.count);
    } catch (e) {
      console.error(e);
    }
  }

  async insert(houses: HouseIndex | HouseIndex[]) {
    if (Array.isArray(houses)) {
      const data = houses.map((p) => this.document(p)).flatMap((a) => a.body);

      return this.searchService.insertIndex({
        body: data,
        index: this.index,
      });
    }

    return this.searchService.insertIndex(this.document(houses));
  }

  async delete(id: number) {
    return this.searchService.deleteDocument({
      index: this.index,
      id: id.toString(),
    });
  }

  private document(house: HouseIndex) {
    const bulk = [];
    bulk.push({ index: { _index: this.index, _id: house.id?.toString() } });

    bulk.push(house);

    return {
      body: bulk,
      index: this.index,
    };
  }

  async paginate(dto: SearchHousesQueryDto) {
    const fields: Fields = ['title^10']; // Give more weight to the name field

    const result = await this.searchService.searchIndex({
      index: this.index,
      /* from: offset, */
      /* size: limit, */
      body: {
        query: {
          bool: {
            should: [
              {
                multi_match: {
                  query: dto?.q, // Search by the query string
                  minimum_should_match: '3<90%', // https://www.elastic.co/guide/en/elasticsearch/reference/7.17/query-dsl-minimum-should-match.html
                  operator: 'and',
                  type: 'bool_prefix', // This allows to get results even if the query is not complete, ex: If I search: `fi`, it can get results with `fish`
                  fields,
                },
              },
              {
                multi_match: {
                  query: dto?.q,
                  operator: 'and',
                  fuzziness: 'auto',
                  fields,
                },
              },
            ],
          },
        },
      },
    });

    return result;
  }
}
