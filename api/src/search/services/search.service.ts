import { Injectable } from '@nestjs/common';
import type { Client as NewTypes } from '@opensearch-project/opensearch/api/new';
import {
  BulkRequest,
  CountRequest,
  DeleteByQueryRequest,
  DeleteRequest,
  GetRequest,
  IndicesCreateRequest,
  IndicesDeleteRequest,
  IndicesExistsRequest,
  SearchRequest,
  UpdateRequest,
} from '@opensearch-project/opensearch/api/types';
import { Client } from '@opensearch-project/opensearch';

@Injectable()
export class SearchService<T> {
  searchClient: NewTypes;

  constructor() {
    const node = 'http://opensearch-node:9200';

    // @ts-expect-error - This is a workaround for the missing types in the opensearch package
    this.searchClient = new Client({
      node,
    });
  }

  public async existsIndex(params: IndicesExistsRequest) {
    try {
      return await this.searchClient.indices.exists(params);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async createIndex(params: IndicesCreateRequest) {
    try {
      return await this.searchClient.indices.create(params);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async insertIndex(bulkData: BulkRequest<T>) {
    try {
      return await this.searchClient.bulk<T>(bulkData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async updateIndex(updateData: UpdateRequest<T>) {
    try {
      return await this.searchClient.update<T>({
        ...updateData,
        retry_on_conflict: 3,
      });
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async getDocument(indexData: GetRequest) {
    try {
      return await this.searchClient.get<T>(indexData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async countIndex(countData: CountRequest) {
    try {
      return await this.searchClient.count<T>(countData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async searchIndex(searchData: SearchRequest) {
    try {
      return await this.searchClient.search<T>(searchData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async deleteByQueryIndex(request: DeleteByQueryRequest) {
    try {
      return await this.searchClient.deleteByQuery<T>(request);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async deleteIndex(indexData: IndicesDeleteRequest) {
    try {
      return await this.searchClient.indices.delete<T>(indexData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }

  public async deleteDocument(indexData: DeleteRequest) {
    try {
      return await this.searchClient.delete<T>(indexData);
    } catch (err) {
      if (process.env.NODE_ENV !== 'test') {
        console.error(JSON.stringify(err, null, 2));
      }
    }
  }
}
