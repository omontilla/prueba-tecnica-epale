import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CommentService {
  private readonly baseUrl: string;
  constructor(private configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('CONTENT_SERVICE_URL');
  }
  async getByContent(contentId: number) {
    const res = await axios.get(`${this.baseUrl}/${contentId}/comments`);
    return res.data.map((comment) => ({
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    }));
  }

  async addComment(contentId: number, input: any) {
    const res = await axios.post(
      `${this.baseUrl}/${contentId}/comments`,
      input,
    );
    const comment = res.data;
    return {
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    };
  }

  async moderate(commentId: number) {
    const res = await axios.put(
      `${this.baseUrl}/comments/${commentId}/moderate`,
    );

    if (!res.data) {
      throw new Error(`Comentario con id ${commentId} no encontrado`);
    }
    const comment = res.data;
    return {
      ...comment,
      createdAt: new Date(comment.createdAt),
      updatedAt: new Date(comment.updatedAt),
    };
  }
}
