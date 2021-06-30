import { UnprocessableEntityException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateFolderDto } from '../dtos/CreateFolder.dto';

export class CreateFolderValidator {
  public static validate(dto: CreateFolderDto): CreateFolderDto {
    const { color, name, parent, icon } = dto;

    if (!name || name.length === 0) {
      throw new UnprocessableEntityException('Invalid folder name');
    }

    if (!color || color.length < 4 || color.length > 7) {
      throw new UnprocessableEntityException('Invalid color');
    }

    if (parent && !isValidObjectId(parent)) {
      throw new UnprocessableEntityException('Invalid parent folder');
    }

    return {
      name: name,
      color: color,
      parent: parent,
      icon: icon,
    };
  }
}
