import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as AWS from 'aws-sdk';
import { isValidObjectId, Model } from 'mongoose';
import { IAWSFile } from './interfaces/IAWSFile.interface';
import { IAWSUploadedFile } from './interfaces/IAWSUploadedFile.interface';
import { AWSFile } from './schemas/AWSFile.schema';

@Injectable()
export class DriveService {
  constructor(
    @InjectModel(AWSFile.name) private awsFileModel: Model<AWSFile>,
  ) {}

  public async getFilesInAWS(): Promise<IAWSFile[]> {
    return await this.awsFileModel.find();
  }

  public async removeFileFromAWS(id: string): Promise<string> {
    if (!id || id.length < 10 || !isValidObjectId(id)) {
      throw new UnprocessableEntityException('invalid id');
    }

    const item = await this.awsFileModel.findOne({ _id: id });
    this.deleteFile(item._id, item.Key);
    return 'success';
  }

  public async uploadFileToAWS(file: IAWSUploadedFile): Promise<IAWSFile> {
    return await this.awsFileModel.create(file);
  }

  private async deleteFile(_id: string, Key: string): Promise<void> {
    if (!_id || !Key) return;

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
    await this.awsFileModel.deleteOne({ _id: _id });
  }
}
