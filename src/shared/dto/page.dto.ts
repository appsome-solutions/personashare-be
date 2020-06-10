import { Field, ObjectType } from 'type-graphql';
import { UploadFileDto } from './upload-file.dto';

@ObjectType()
export class PageType {
  @Field({ nullable: true })
  avatar?: string;

  @Field({ nullable: true })
  background?: string;

  @Field()
  content: string;

  @Field(() => [UploadFileDto], { nullable: true })
  fileList?: UploadFileDto[];
}
