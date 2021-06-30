import { UnprocessableEntityException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { PatchFileDto } from '../dtos/PatchFile.dto';

export class PatchFileValidator {
  public static validate(dto: PatchFileDto): PatchFileDto {
    const { folderId, name, pinned, tags } = dto;

    if (!folderId || !isValidObjectId(folderId)) {
      throw new UnprocessableEntityException('Invalid folder id');
    }

    if (!name || name.length < 0) {
      throw new UnprocessableEntityException('Invalid file name');
    }

    return {
      folderId: folderId,
      name: name,
      pinned: !!pinned,
      tags: tags,
    };
  }
}
