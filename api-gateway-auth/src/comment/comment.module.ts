import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolve } from './comment.resolve';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [CommentResolve, CommentService],
})
export class CommentModule {}
