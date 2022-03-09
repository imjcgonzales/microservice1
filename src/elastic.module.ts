import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ElasticService } from './elastic.service';

@Module({
  imports: [   
    ConfigModule.forRoot(),
    ElasticsearchModule.registerAsync({
        imports: [ConfigModule.forRoot()],
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          node: config.get('ELASTIC_NODE'),
          auth: {
              username: config.get('ELASTIC_USERNAME'),
              password: config.get('ELASTIC_PASSWORD'),
          },
        }),
    }),
  ],
  controllers: [],
  providers: [ElasticService],
  exports:[ElasticService]
})
export class ElasticModule{}