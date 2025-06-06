import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UploadVideoInput } from './dto/video-upload.input';
import * as FormData from 'form-data';
import { Content } from './dto/content.model';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ContentService {
  private readonly baseUrl: string;
  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('CONTENT_SERVICE_URL');
  }

  async uploadVideo(input: UploadVideoInput): Promise<Content> {
    const { createReadStream, filename } = await input.video;

    const form = new FormData();
    form.append('video', createReadStream(), { filename });
    form.append('title', input.title);
    form.append('description', input.description);

    const res = await axios.post(`${this.baseUrl}/upload`, form, {
      headers: form.getHeaders(),
    });

    const comment = res.data;
    return {
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    };
  }
  async getContent(id: number) {
    const res = await axios.get(`${this.baseUrl}/${id}`);
    const content = res.data;
    return {
      ...content,
      createdAt: new Date(content.createdAt),
      updatedAt: new Date(content.updatedAt),
      comments:
        content.comments?.map((c) => ({
          ...c,
          createdAt: new Date(c.createdAt),
          updatedAt: new Date(c.updatedAt),
        })) ?? [],
    };
  }

  async updateContent(id: number, input: any) {
    const res = await axios.put(`${this.baseUrl}/${id}`, input);
    if (!res.data) {
      throw new Error(`Contenido con id ${id} no encontrado`);
    }
    return res.data;
  }

  async deleteContent(id: number) {
    await axios.delete(`${this.baseUrl}/${id}`);
    return true;
  }
}
