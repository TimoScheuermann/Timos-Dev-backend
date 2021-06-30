import { IProjectSection } from '../interfaces/IProjectSection.interface';

export class UpdateSectionsDTO {
  _id: string;
  sections: IProjectSection[];
}
