import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { NotificationsGateway } from './notifications.gateway';

@Controller()
export class NotificationsConsumer {
  constructor(private readonly gateway: NotificationsGateway) {}

  @MessagePattern('notifications.new')
  handleNewNotification(@Payload() data: any) {
    this.gateway.notifyAll(data);
  }
}