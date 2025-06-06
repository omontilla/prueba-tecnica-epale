import { ObjectType, Field, GraphQLISODateTime, Int } from '@nestjs/graphql';
import { Comment } from '../../comment/dto/comment.model';

@ObjectType()
export class Content {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field()
  videoUrl: string;

  @Field({ nullable: true })
  thumbnailUrl?: string;

  @Field(() => [Comment], { nullable: true })
  comments?: Comment[];

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
}
