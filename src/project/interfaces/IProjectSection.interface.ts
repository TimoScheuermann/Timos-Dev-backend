import { IProjectSectionItem } from './IProjectSectionItem.interface';

export interface IProjectSection {
  title: string;
  subtitle: string;
  items: IProjectSectionItem[];
}
