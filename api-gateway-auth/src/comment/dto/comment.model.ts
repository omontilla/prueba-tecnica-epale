import { ObjectType, Field, GraphQLISODateTime, Int } from '@nestjs/graphql';

@ObjectType()
export class Comment {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  contentId: number;

  @Field()
  text: string;

  @Field()
  moderated: boolean;

  @Field(() => GraphQLISODateTime, { nullable: true })
  createdAt: Date;

  @Field(() => GraphQLISODateTime, { nullable: true })
  updatedAt: Date;
}
