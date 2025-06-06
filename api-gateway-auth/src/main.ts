import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    graphqlUploadExpress({
      maxFileSize: 100 * 1024 * 1024,
      maxFiles: 1,
      overrideSendResponse: false,
    }),
  );

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'notifications-service',
      queueOptions: { durable: true },
    },
  });
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log(
    '[✓] api-gateway-auth escuchando en http://localhost:3000/graphql',
  );
}
bootstrap();
