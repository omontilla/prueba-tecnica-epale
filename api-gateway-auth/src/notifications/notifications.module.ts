import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { NotificationsConsumer } from './notifications.consumer';

@Module({
  providers: [NotificationsGateway],
  controllers: [NotificationsConsumer],
})
export class NotificationsModule {}
