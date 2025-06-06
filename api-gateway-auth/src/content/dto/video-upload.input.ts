import { InputType, Field } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class UploadVideoInput {
  @Field(() => GraphQLUpload)
  video: Promise<FileUpload>;

  @Field()
  title: string;

  @Field()
  description: string;
}