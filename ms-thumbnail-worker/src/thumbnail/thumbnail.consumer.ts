import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ThumbnailService } from './thumbnail.service';

@Controller()
export class ThumbnailConsumer {
  constructor(private readonly thumbnailService: ThumbnailService) {}

  @MessagePattern('video.convert')
  async handleVideoConvert(@Payload() data: any) {
    const { videoId } = data;
    await this.thumbnailService.generate(videoId);
  }
}
