import { Injectable } from '@nestjs/common';
import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import * as fs from 'fs';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ThumbnailService {
  private readonly baseUrl: string;
  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('CONTENT_SERVICE_URL');
  }
  async generate(videoId: string) {
    const videoPath = `/tmp/videos/${videoId}.mp4`;
    const outputDir = `/tmp/thumbnails`;
    const thumbnailPath = path.join(outputDir, `${videoId}.jpg`);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    return new Promise(async (resolve, reject) => {
      ffmpeg(videoPath)
        .on('end', () => {
          console.log(`Thumbnail generado: ${thumbnailPath}`);
          resolve(thumbnailPath);
        })
        .on('error', (err) => {
          console.error(`Error al generar thumbnail:`, err.message);
          reject(err);
        })
        .screenshots({
          timestamps: ['00:00:03'],
          filename: `${videoId}.jpg`,
          folder: outputDir,
          size: '320x240',
        });

      await axios.put(`${this.baseUrl}/${videoId}/thumbnail`, {
        thumbnailUrl: `${outputDir}/${videoId}.jpg`,
      });
    });
  }
}
