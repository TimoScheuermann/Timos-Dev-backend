import { UnprocessableEntityException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { CreateFileDto } from '../dtos/CreateFile.dto';

export class CreateFileValidator {
  public static validate(dto: CreateFileDto): CreateFileDto {
    const { folderId } = dto;

    if (!folderId || !isValidObjectId(folderId)) {
      throw new UnprocessableEntityException('Invalid folder id');
    }

    return {
      folderId: folderId,
    };
  }
}
