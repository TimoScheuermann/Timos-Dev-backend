export class UpdateNewsDTO {
  _id: string;
  title?: string;
  project?: string;
  type?: 'update' | 'release' | 'feature';
  timestamp?: number;
  content?: string;
  thumbnail?: string;
  featured?: string;
}
