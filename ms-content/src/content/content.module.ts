import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Content } from './entity/content.entity';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content]),
    ClientsModule.register([
      {
        name: 'THUMBNAIL_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
          queue: 'thumbnail-service',
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
