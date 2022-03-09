import { ConsoleLogger, HttpException, Inject, Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class ElasticService {
  @Inject() private readonly elasticsearchService: ElasticsearchService

  async save(document: { _id: string }, index: string): Promise<void> {
      const id = document._id
      delete document._id

      await this.elasticsearchService.index({
          id,
          index: index,
          body: document,
      })
  }
  
  async aggregate<T>(query: {
    [key: string]: any;
  }): Promise<{ data: T[]; aggregations: any }> {
    const { body } = await this.elasticsearchService.search({
      index: 'elements',
      body: query,
    });
    const data = body.hits.hits.map((item) => item._source);
    return { data, aggregations: body.aggregations };
  }

  async search<T>(query:{
    [key: string]: any;
  }): Promise<{ data: T[]; count: number } | any> {
    try {
      const { body } = await this.elasticsearchService.search({
        index: 'elements',
        body: query,
      });
      const results = body.hits.hits.map((item) => ({
        _id: item._id,
        ...item._source,
        ...item.fields,
      }));
      console.log(results);
      
      return { data: results, count: body.hits.total.value };
    } catch (err) {
      throw new HttpException(err, 500);
    }
  }
}