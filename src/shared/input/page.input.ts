import { IsString, IsOptional } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { UploadFileInput } from './upload-file.input';
import { UploadedFile } from '../interfaces';

@InputType()
export class PageInput {
  @Field()
  @IsString()
  content: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  avatar?: string;

  @Field({
    nullable: true,
  })
  @IsString()
  @IsOptional()
  background?: string;

  @Field(() => [UploadFileInput], {
    nullable: true,
  })
  @IsOptional()
  fileList?: UploadedFile[];
}
