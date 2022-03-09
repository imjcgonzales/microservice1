import { Controller, Get, HttpStatus, Inject, Res } from '@nestjs/common';
import { ClientProxy, Ctx, EventPattern, MessagePattern, MqttContext, Payload, Transport } from '@nestjs/microservices';
import { AppService } from './app.service';
import { ElasticService } from './elastic.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} 

  @Inject('LIMEVOLTS_CLIENT') private readonly mqttclient: ClientProxy
  @Inject() private readonly elasticservice: ElasticService
  async onApplicationBootstrap() {
      await this.mqttclient.connect();
  }

  @MessagePattern('notifications')
  getNotifications(@Payload() data: any, @Ctx() context: MqttContext) {
    console.log(`Topic: ${context.getTopic()}`);
    // console.log(`Data: ${data}`);
  }

  @EventPattern('home/+/+')
  async getCurrent(@Payload() data: any, @Ctx() context: MqttContext) {
    console.log(`${JSON.stringify(data)}`);
    const createdDate= new Date().toISOString();
    await this.elasticservice.save({_id: data.sensorbox1, createdDate, ...data}, 'elements')
  }

  @Get('attributes')
  async getProtectedResource(@Res() res: Response): Promise<any> {
    return res
      .status(HttpStatus.OK)
      .json(await this.appService.getAttributes("1"));
  }
}

