import { IProjectNewsroom } from 'src/project/interfaces/IProjectNewsroom.interface';

export interface INewsExtended {
  _id?: string;
  title: string;
  project: IProjectNewsroom;
  type: 'update' | 'release' | 'feature';
  timestamp: number;
  content: string;
  thumbnail: string;
  featured?: string;
}
