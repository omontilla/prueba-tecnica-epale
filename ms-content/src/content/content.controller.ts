import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  Put,
  Delete,
} from '@nestjs/common';
import { ContentService } from './content.service';
import { CreateContentDto } from './dto/create-content.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UpdateContentDto } from './dto/update-content.dto';

@Controller('content')
export class ContentController {
  constructor(private readonly service: ContentService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('video', {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const dest = '/tmp/videos';
          if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
          }
          cb(null, dest);
        },
        filename: (req, file, cb) => {
          cb(null, `upload-temp${path.extname(file.originalname) || '.mp4'}`);
        },
      }),
    }),
  )
  upload(
    @UploadedFile() video: any, // evitar tipo roto, usar `any` o interfaz
    @Body() body: CreateContentDto & { videoId: number },
  ) {
    return this.service.create(body, video);
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Put(':id/thumbnail')
  updateThumbnail(
    @Param('id') id: string,
    @Body() body: { thumbnailUrl: string },
  ) {
    return this.service.updateThumbnail(id, body.thumbnailUrl);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateContentDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
