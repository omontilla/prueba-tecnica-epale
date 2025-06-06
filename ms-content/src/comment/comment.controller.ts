import { Controller, Post, Param, Body, Get, Put } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('content')
export class CommentController {
  constructor(private readonly service: CommentService) {}

  @Post(':id/comments')
  addComment(@Param('id') contentId: string, @Body() dto: CreateCommentDto) {
    return this.service.addComment(contentId, dto);
  }

  @Get(':id/comments')
  getByContent(@Param('id') contentId: string) {
    return this.service.getCommentsByContentId(contentId);
  }

  @Put('/comments/:id/moderate')
  moderate(@Param('id') id: string) {
    return this.service.moderateComment(id);
  }
}