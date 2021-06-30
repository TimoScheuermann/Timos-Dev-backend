import { IProjectSection } from './IProjectSection.interface';

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  icon: string;

  hero: string;
  thumbnail: string;

  displayOnHome: boolean;

  website?: string;
  github?: string;
  npmjs?: string;

  designTools: string[];
  frameworks: string[];
  development: string[];

  sections?: IProjectSection[];
}
