import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Content } from './entity/content.entity';
import { CreateContentDto } from './dto/create-content.dto';
import { ClientProxy } from '@nestjs/microservices';
import { UpdateContentDto } from './dto/update-content.dto';
import * as fs from 'node:fs';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepo: Repository<Content>,
    @Inject('THUMBNAIL_SERVICE')
    private readonly client: ClientProxy,
  ) {}

  async create(
    dto: CreateContentDto & { videoId: number },
    video: any,
  ): Promise<Content> {
    const tempPath = video.path;
    const content = this.contentRepo.create({
      ...dto,
      videoUrl: '',
    });
    const saved = await this.contentRepo.save(content);

    const finalName = `${saved.id}.mp4`;
    const finalPath = `/tmp/videos/${finalName}`;
    fs.renameSync(tempPath, finalPath); // renombrar archivo

    content.videoUrl = finalPath;
    await this.contentRepo.save(content);
    this.client.emit('video.convert', { videoId: saved.id });

    return content;
  }

  async updateThumbnail(id, thumbnailUrl: string): Promise<Content> {
    const content = await this.contentRepo.findOneBy({ id });
    if (!content) throw new NotFoundException('Contenido no encontrado');

    content.thumbnailUrl = thumbnailUrl;
    return this.contentRepo.save(content);
  }

  async findOne(id): Promise<Content> {
    const content = await this.contentRepo
      .createQueryBuilder('content')
      .leftJoinAndSelect(
        'content.comments',
        'comment',
        'comment.moderated = :moderated',
        {
          moderated: true,
        },
      )
      .where('content.id = :id', { id })
      .getOne();

    if (!content) throw new NotFoundException('Contenido no encontrado');
    return content;
  }

  async update(id, dto: UpdateContentDto): Promise<Content> {
    const content = await this.contentRepo.findOneBy({ id });
    if (!content) throw new NotFoundException('Contenido no encontrado');

    Object.assign(content, dto);
    return this.contentRepo.save(content);
  }

  async delete(id): Promise<{ deleted: boolean }> {
    const result = await this.contentRepo.delete({ id });

    if (result.affected > 0) {
      const videoPath = `/tmp/videos/${id}.mp4`;
      const thumbPath = `/tmp/thumbnails/${id}.jpg`;

      if (fs.existsSync(videoPath)) fs.unlinkSync(videoPath);
      if (fs.existsSync(thumbPath)) fs.unlinkSync(thumbPath);
    }

    return { deleted: result.affected > 0 };
  }
}
