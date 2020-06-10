type UploadFileStatus = 'error' | 'success' | 'done' | 'uploading' | 'removed';

export interface UploadedFile {
  uid: string;
  size: number;
  name: string;
  url: string;
  thumbUrl: string;
  status: UploadFileStatus;
}
