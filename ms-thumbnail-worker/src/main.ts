import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
        queue: 'thumbnail-service',
        queueOptions: { durable: true },
      },
    },
  );

  await app.listen();
  console.log('[✓] ms-thumbnail-worker está escuchando mensajes');
}
bootstrap();
