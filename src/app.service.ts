import { Inject, Injectable } from '@nestjs/common';
import { ElasticService } from './elastic.service';


@Injectable()
export class AppService {
  @Inject() private readonly esService: ElasticService
  async getAttributes(ids:string) {
    const esQuery = {
      size:10,
      query: {
        bool: {
          filter: {
            term: {
              id: "1"
            }
          }
        }
      }
    };

    console.log(JSON.stringify(esQuery));
    return await this.esService.search(esQuery);
  }
}












