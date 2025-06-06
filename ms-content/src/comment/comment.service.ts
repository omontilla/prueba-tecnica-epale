import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './entity/comment.entity';
import { NotificationService } from '../notification/notification.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepo: Repository<Comment>,
    private readonly notificationService: NotificationService,
  ) {}

  async addComment(contentId: string, dto: CreateCommentDto) {
    const exists = await this.commentRepo.manager.findOne('content', {
      where: { id: contentId },
    });
    if (!exists) {
      throw new NotFoundException(
        `No existe contenido con id ${contentId}, no se puede agregar el comentario.`,
      );
    }

    const comment = this.commentRepo.create({ ...dto, contentId });
    const savedComment = await this.commentRepo.save(comment);
    await this.notificationService.notify(contentId, dto.text);

    return savedComment;
  }

  async getCommentsByContentId(contentId) {
    const comments = await this.commentRepo.find({
      where: { contentId, moderated: true },
      order: { createdAt: 'DESC' },
    });

    if (!comments || comments.length === 0) {
      throw new NotFoundException(
        `No hay comentarios moderados para el contenido con id ${contentId}`,
      );
    }
    return comments;
  }

  async moderateComment(id) {
    const comment = await this.commentRepo.findOneBy({ id });
    if (!comment)
      throw new NotFoundException(`comentario con id ${id} no encontrado`);
    comment.moderated = false;
    return this.commentRepo.save(comment);
  }
}
