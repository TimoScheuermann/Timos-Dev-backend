import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateVMComponentDTO } from './dtos/CreateVMComponent.dto';
import { VMComponent } from './schemas/VMComponent.schema';
import { CreateVMComponentValidator } from './validator/VMComponent.validator';

@Injectable()
export class VuementService {
  constructor(
    @InjectModel(VMComponent.name)
    private readonly vmComponentModel: Model<VMComponent>,
  ) {}

  public async getComponents(): Promise<VMComponent[]> {
    return this.vmComponentModel.find();
  }

  public async createComponent(
    dto: CreateVMComponentDTO,
  ): Promise<VMComponent> {
    dto = CreateVMComponentValidator.validate(dto);
    return this.vmComponentModel.create(dto);
  }

  public async patchComponent(
    id: string,
    dto: CreateVMComponentDTO,
  ): Promise<VMComponent> {
    dto = CreateVMComponentValidator.validate(dto);

    const comp = await this.getComponentById(id);
    if (!comp) {
      throw new UnprocessableEntityException(
        `Couldn't find component with id '${id}'`,
      );
    }

    await comp.update({ $set: dto });
    return this.getComponentById(id);
  }

  private async getComponentById(id: string): Promise<VMComponent | null> {
    if (!isValidObjectId(id)) return null;
    return this.vmComponentModel.findById(id);
  }
}
