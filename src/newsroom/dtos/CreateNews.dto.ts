export class CreateNewsDTO {
  title: string;
  project: string;
  type: 'update' | 'release' | 'feature';
  timestamp: number;
  thumbnail: string;
  content: string;
}
