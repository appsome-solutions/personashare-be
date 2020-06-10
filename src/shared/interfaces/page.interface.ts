import { UploadedFile } from './upload-file.interface';

export interface Page {
  content: string;
  avatar?: string;
  background?: string;
  fileList?: UploadedFile[];
}
