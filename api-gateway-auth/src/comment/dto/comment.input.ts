import { InputType, Field } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateCommentInput {
  @Field()
  @IsString()
  text: string;
}
