import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-aws';
import { extname } from 'path';
import { GroupsGuard, TGroups } from 'src/auth/guards/TGroup.guard';
import { DriveService } from './drive.service';
import { IAWSFile } from './interfaces/IAWSFile.interface';
import { IAWSUploadedFile } from './interfaces/IAWSUploadedFile.interface';

interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

function fileFilter(
  req: any,
  file: UploadedFile,
  callback: (error: Error, acceptFile: boolean) => void,
): void {
  const fileTypes = /png|jpeg|jpg|webp|gif|svg/;
  const extName = fileTypes.test(extname(file.originalname.toLowerCase()));
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    callback(null, true);
  } else {
    callback(new Error('Error: only ' + fileTypes + ' are allowed!'), false);
  }
}
@Controller('drive')
export class DriveController {
  constructor(private readonly driveService: DriveService) {}

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      randomFilename: true,
      fileFilter: fileFilter,
    }),
  )
  @Post('')
  async uploadFilesToAWS(
    @UploadedFile() file: IAWSUploadedFile,
  ): Promise<IAWSFile> {
    return this.driveService.uploadFileToAWS(file);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      randomFilename: true,
      dynamicPath: ['folder'],
      fileFilter: fileFilter,
    }),
  )
  @Post(':folder')
  async uploadFilesToAWSFolder(
    @UploadedFile() file: IAWSUploadedFile,
  ): Promise<IAWSFile> {
    return this.driveService.uploadFileToAWS(file);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @UseInterceptors(AmazonS3FileInterceptor('file', { randomFilename: true }))
  @Delete(':id')
  async removeFileFromAWS(@Param('id') id: string): Promise<string> {
    return this.driveService.removeFileFromAWS(id);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Get()
  async getFilesInAWS(): Promise<IAWSFile[]> {
    return this.driveService.getFilesInAWS();
  }
}
