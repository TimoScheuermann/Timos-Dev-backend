import { UnprocessableEntityException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { PatchFolderDto } from '../dtos/PatchFolder.dto';

export class PatchFolderValidator {
  public static validate(dto: PatchFolderDto): PatchFolderDto {
    const { color, icon, parent, name, pinned } = dto;

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
      color: color,
      icon: icon && icon.length > 0 ? icon : null,
      name: name,
      parent: parent && parent.length > 0 ? parent : null,
      pinned: !!pinned,
    };
  }
}
