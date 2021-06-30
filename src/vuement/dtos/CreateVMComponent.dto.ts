import { VMProp } from '../models/VMProp.model';

export class CreateVMComponentDTO {
  name: string;
  image: string;
  children: string[];
  isChild: boolean;
  props: VMProp[];
}
