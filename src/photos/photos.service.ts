import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from 'aws-sdk';
import { isValidObjectId, Model } from 'mongoose';
import { CreateFileDto } from './dtos/CreateFile.dto';
import { CreateFolderDto } from './dtos/CreateFolder.dto';
import { PatchFileDto } from './dtos/PatchFile.dto';
import { PatchFolderDto } from './dtos/PatchFolder.dto';
import { AWSFile } from './models/AWSFile.model';
import { TPFile } from './schemas/TPFile.schema';
import { TPFolder } from './schemas/TPFolder.schema';
import { CreateFileValidator } from './util/CreateFile.validator';
import { CreateFolderValidator } from './util/CreateFolder.validator';
import { PatchFileValidator } from './util/PatchFile.validator';
import { PatchFolderValidator } from './util/PatchFolder.validator';

@Injectable()
export class PhotosService {
  constructor(
    @InjectModel(TPFolder.name) private readonly tpFolderModel: Model<TPFolder>,
    @InjectModel(TPFile.name) private readonly tpFileModel: Model<TPFile>,
  ) {}

  public async getFiles(): Promise<TPFile[]> {
    return this.tpFileModel.find();
  }

  public async getFile(id: string): Promise<TPFile> {
    if (!isValidObjectId(id)) {
      throw new UnprocessableEntityException('Invalid File ID');
    }
    const file = await this.tpFileModel.findOne({ _id: id });
    if (!file) {
      throw new UnprocessableEntityException('Invalid File ID');
    }

    return file;
  }

  public async getFolders(): Promise<TPFolder[]> {
    return this.tpFolderModel.find();
  }

  public async getFolder(id: string): Promise<TPFolder> {
    if (!isValidObjectId(id)) {
      throw new UnprocessableEntityException('Invalid Folder ID');
    }
    const folder = await this.tpFolderModel.findOne({ _id: id });
    if (!folder) {
      throw new UnprocessableEntityException('Invalid Folder ID');
    }

    return folder;
  }

  public async uploadFile(file: AWSFile, dto: CreateFileDto): Promise<TPFile> {
    try {
      dto = CreateFileValidator.validate(dto);
      await this.getFolder(dto.folderId);
    } catch (error) {
      await this.deleteFileOnAWS(file.Key);
      throw error;
    }

    return await this.tpFileModel.create({
      ...file,
      ...dto,
      name: file.originalname,
      pinned: false,
      created: Date.now(),
      tags: [],
    });
  }

  public async postFolder(dto: CreateFolderDto): Promise<TPFolder> {
    dto = CreateFolderValidator.validate(dto);
    return this.tpFolderModel.create(dto);
  }

  public async patchFile(id: string, dto: PatchFileDto): Promise<TPFile> {
    dto = PatchFileValidator.validate(dto);
    await this.getFile(id);
    await this.getFolder(dto.folderId);

    await this.tpFileModel.updateOne({ _id: id }, { $set: dto });

    return this.getFile(id);
  }

  public async patchFolder(id: string, dto: PatchFolderDto): Promise<TPFolder> {
    await this.getFolder(id);

    dto = PatchFolderValidator.validate(dto);

    if (dto.parent) {
      const tree = await this.getFolderTree(id);
      if (tree.includes(dto.parent)) {
        throw new UnprocessableEntityException(
          'New parent folder cant be one of your child folders',
        );
      }
    }

    await this.tpFolderModel.updateOne({ _id: id }, { $set: dto });
    return this.getFolder(id);
  }

  public async deleteFile(id: string): Promise<boolean> {
    const file = await this.getFile(id);
    if (!file) return false;

    await this.deleteFileOnAWS(file.Key);
    await file.delete();

    return true;
  }

  public async deleteFolder(id: string): Promise<boolean> {
    const folder = await this.getFolder(id);
    if (!folder) return false;

    const folders = await this.tpFolderModel.find({ parent: id });
    if (folders.length > 0) {
      throw new UnprocessableEntityException(
        'Folder still has subfolders linked to it, abord.',
      );
    }

    const files = await this.tpFileModel.find({ folderId: id });
    if (files.length > 0) {
      throw new UnprocessableEntityException(
        'Folder still has files linked to it, abord.',
      );
    }

    await folder.delete();
    return true;
  }

  public async pinFile(id: string, pin: boolean): Promise<void> {
    if (!id || !isValidObjectId(id)) return;
    await this.tpFileModel.updateOne({ _id: id }, { $set: { pinned: pin } });
  }

  public async pinFolder(id: string, pin: boolean): Promise<void> {
    if (!id || !isValidObjectId(id)) return;
    await this.tpFolderModel.updateOne({ _id: id }, { $set: { pinned: pin } });
  }

  public async searchLib(
    query: string,
  ): Promise<{ folders: TPFolder[]; files: TPFile[] }> {
    const reg = new RegExp(query, 'i');
    const folders = await this.tpFolderModel.find({
      $or: [{ name: reg }, { icon: reg }],
    });
    const files = await this.tpFileModel.find({
      $or: [{ name: reg }, { $expr: { $in: [reg, '$tags'] } }],
    });

    return {
      folders: folders,
      files: files,
    };
  }

  private async deleteFileOnAWS(Key: string): Promise<void> {
    if (!Key) return;

    const s3 = new AWS.S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET,
      },
      region: process.env.AWS_REGION,
    });

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: Key,
    };
    await s3.deleteObject(params).promise();
  }

  private async getFolderTree(
    id: string,
    subFolders: string[] = [],
  ): Promise<string[]> {
    const folders = await this.tpFolderModel.find({ parent: id });
    await Promise.all(
      folders.map(async (f) => {
        subFolders.push(f.toJSON().id);
        subFolders.push(...(await this.getFolderTree(f._id, subFolders)));
        return f;
      }),
    );
    return [...new Set(subFolders)];
  }
}
