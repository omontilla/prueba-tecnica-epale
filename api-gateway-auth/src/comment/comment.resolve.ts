import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { Comment } from './dto/comment.model';
import { CreateCommentInput } from './dto/comment.input';
import { CommentService } from './comment.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Comment)
export class CommentResolve {
  constructor(private readonly service: CommentService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => [Comment])
  getComments(@Args('contentId') contentId: number): Promise<Comment[]> {
    return this.service.getByContent(contentId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  addComment(
    @Args('contentId') contentId: number,
    @Args('input') input: CreateCommentInput,
  ): Promise<Comment> {
    return this.service.addComment(contentId, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Comment)
  moderateComment(@Args('commentId') commentId: number): Promise<Comment> {
    return this.service.moderate(commentId);
  }
}
