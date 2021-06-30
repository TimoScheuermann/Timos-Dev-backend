import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-aws';
import { GroupsGuard, TGroups } from 'src/auth/guards/TGroup.guard';
import { CreateFileDto } from './dtos/CreateFile.dto';
import { CreateFolderDto } from './dtos/CreateFolder.dto';
import { PatchFileDto } from './dtos/PatchFile.dto';
import { PatchFolderDto } from './dtos/PatchFolder.dto';
import { AWSFile } from './models/AWSFile.model';
import { PhotosService } from './photos.service';
import { TPFile } from './schemas/TPFile.schema';
import { TPFolder } from './schemas/TPFolder.schema';
import { fileFilter } from './util/FileFilter.util';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Get('folders')
  async getFolders(): Promise<TPFolder[]> {
    return this.photosService.getFolders();
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Get('files')
  async getFiles(): Promise<TPFile[]> {
    return this.photosService.getFiles();
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Patch('file/:id')
  async patchFile(
    @Param('id') id: string,
    @Body() dto: PatchFileDto,
  ): Promise<TPFile> {
    return this.photosService.patchFile(id, dto);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Patch('folder/:id')
  async patchFolder(
    @Param('id') id: string,
    @Body() dto: PatchFolderDto,
  ): Promise<TPFolder> {
    return this.photosService.patchFolder(id, dto);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete('file/:id')
  async deleteFile(@Param('id') id: string): Promise<boolean> {
    return this.photosService.deleteFile(id);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete('folder/:id')
  async deleteFolder(@Param('id') id: string): Promise<boolean> {
    return this.photosService.deleteFolder(id);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @UseInterceptors(
    AmazonS3FileInterceptor('file', {
      randomFilename: true,
      fileFilter: fileFilter,
    }),
  )
  @Post('file')
  async postFile(
    @UploadedFile() file: AWSFile,
    @Body() dto: CreateFileDto,
  ): Promise<TPFile> {
    return this.photosService.uploadFile(file, dto);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('folder')
  async postFolder(@Body() dto: CreateFolderDto): Promise<TPFolder> {
    return this.photosService.postFolder(dto);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('pin/file/:id')
  async pinFile(@Param('id') id: string): Promise<void> {
    await this.photosService.pinFile(id, true);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('unpin/file/:id')
  async unpinFile(@Param('id') id: string): Promise<void> {
    await this.photosService.pinFile(id, false);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('pin/folder/:id')
  async pinFolder(@Param('id') id: string): Promise<void> {
    await this.photosService.pinFolder(id, true);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('unpin/folder/:id')
  async unpinFolder(@Param('id') id: string): Promise<void> {
    await this.photosService.pinFolder(id, false);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('search')
  async searchLib(
    @Body() body: { q: string },
  ): Promise<{ folders: TPFolder[]; files: TPFile[] }> {
    return this.photosService.searchLib(body.q);
  }
}
