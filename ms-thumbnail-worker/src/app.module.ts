import { Module } from '@nestjs/common';
import { ThumbnailModule } from './thumbnail/thumbnail.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThumbnailModule,
  ],
})
export class AppModule {}
