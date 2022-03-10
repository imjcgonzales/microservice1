import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    app.enableCors()
    app.connectMicroservice({
      transport: Transport.MQTT,
      options: {
        url: 'mqtt://192.168.50.238:1883',
        username: 'limevolts',
        password: 'lv123',
        clientId: '',
               },
              })
  await app.startAllMicroservices();
  await app.listen(3009);
}

bootstrap();

