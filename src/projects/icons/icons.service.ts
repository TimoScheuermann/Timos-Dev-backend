import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { IAWSUploadedFile } from 'src/drive/interfaces/IAWSUploadedFile.interface';
import { ChangeVariantDTO } from './dtos/ChangeVariant.dto';
import { CreateIconDTO } from './dtos/CreateIcon.dto';
import { UpdateIconDTO } from './dtos/UpdateIcon.dto';
import { IIcon } from './interfaces/IIcon.interface';
import { IIconVersion } from './interfaces/IIconVersion.interface';
import { Icon } from './schemas/Icon.schema';

@Injectable()
export class IconsService {
  constructor(@InjectModel(Icon.name) private iconModel: Model<Icon>) {}

  public async getIcons(): Promise<IIcon[]> {
    return this.iconModel.find();
  }

  public async createIcon(
    createIconDTO: CreateIconDTO,
    file: IAWSUploadedFile,
  ): Promise<IIcon> {
    const { versionMajor, versionMinor } = createIconDTO;

    if (!versionMajor || versionMajor <= 0) {
      throw new UnprocessableEntityException('invalid versionMajor');
    }
    if (!versionMinor || versionMinor < 0) {
      throw new UnprocessableEntityException('invalid versionMinor');
    }

    return await this.iconModel.create({
      ...createIconDTO,
      ...file,
      name: file.originalname.split('.')[0],
    });
  }

  public async updateIcon(
    id: string,
    updateIconDTO: UpdateIconDTO,
  ): Promise<IIcon> {
    await this.validateIconId(id);

    this.iconModel.updateOne({ _id: id }, { $set: updateIconDTO });
    return await this.iconModel.findOne({ _id: id });
  }

  public async addVariant(
    id: string,
    changeVariantDTO: ChangeVariantDTO,
  ): Promise<IIcon> {
    await this.validateIconId(id);

    const { variant } = changeVariantDTO;
    if (!variant || variant.length === 0) {
      throw new UnprocessableEntityException('invalid variant');
    }

    await this.iconModel.updateOne(
      { _id: id },
      { $addToSet: { variants: variant } },
    );
    return await this.iconModel.findOne({ _id: id });
  }

  public async removeVariant(
    id: string,
    changeVariantDTO: ChangeVariantDTO,
  ): Promise<IIcon> {
    await this.validateIconId(id);

    const { variant } = changeVariantDTO;
    if (!variant || variant.length === 0) {
      throw new UnprocessableEntityException('invalid variant');
    }

    await this.iconModel.updateOne(
      { _id: id },
      { $pull: { variants: variant } },
    );
    return await this.iconModel.findOne({ _id: id });
  }

  public async getVersions(): Promise<IIconVersion[]> {
    // const versions = await this.iconModel.distinct()
    return [];
  }

  private async validateIconId(id: string): Promise<boolean> {
    if (!isValidObjectId(id)) {
      throw new UnprocessableEntityException('invalid id');
    }
    const icon = await this.iconModel.findOne({ _id: id });
    if (!icon) {
      throw new UnprocessableEntityException('invalid id');
    }

    return true;
  }
}
