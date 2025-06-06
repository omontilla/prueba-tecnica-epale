import { IsString } from 'class-validator';

export class CreateContentDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  videoUrl: string;
}
