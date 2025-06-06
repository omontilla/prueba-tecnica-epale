import { Module } from '@nestjs/common';
import { ThumbnailService } from './thumbnail.service';
import { ThumbnailConsumer } from './thumbnail.consumer';

@Module({
  providers: [ThumbnailService],
  controllers: [ThumbnailConsumer],
})
export class ThumbnailModule {}
