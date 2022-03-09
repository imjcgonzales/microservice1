import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ElasticModule } from './elastic.module';

@Module({
  imports: [
    ElasticModule,
    ClientsModule.register([
      {
        name: 'LIMEVOLTS_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: 'mqtt://192.168.50.238:1883',
          username: 'limevolts',
          password: 'lv123',
          clientId: '',
        }
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

















