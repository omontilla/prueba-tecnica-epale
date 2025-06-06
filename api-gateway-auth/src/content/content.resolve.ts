import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ContentService } from './content.service';
import { Content } from './dto/content.model';
import { UpdateContentInput } from './dto/content.input';
import { UploadVideoInput } from './dto/video-upload.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';

@Resolver(() => Content)
export class ContentResolve {
  constructor(private readonly service: ContentService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Content)
  async uploadVideo(@Args('input') input: UploadVideoInput): Promise<Content> {
    return this.service.uploadVideo(input);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Content)
  async getContent(@Args('id') id: number) {
    return await this.service.getContent(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Content)
  async updateContent(
    @Args('id') id: number,
    @Args('input') input: UpdateContentInput,
  ) {
    return this.service.updateContent(id, input);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteContent(@Args('id') id: number) {
    return this.service.deleteContent(id);
  }
}
