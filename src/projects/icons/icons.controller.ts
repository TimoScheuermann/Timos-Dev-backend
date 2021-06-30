import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AmazonS3FileInterceptor } from 'nestjs-multer-aws';
import { extname } from 'path';
import { GroupsGuard, TGroups } from 'src/auth/guards/TGroup.guard';
import { IAWSUploadedFile } from 'src/drive/interfaces/IAWSUploadedFile.interface';
import { ChangeVariantDTO } from './dtos/ChangeVariant.dto';
import { CreateIconDTO } from './dtos/CreateIcon.dto';
import { UpdateIconDTO } from './dtos/UpdateIcon.dto';
import { IconsService } from './icons.service';
import { IIcon } from './interfaces/IIcon.interface';
import { IIconVersion } from './interfaces/IIconVersion.interface';

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
  const fileTypes = /svg/;
  const extName = fileTypes.test(extname(file.originalname.toLowerCase()));
  const mimeType = fileTypes.test(file.mimetype);
  if (extName && mimeType) {
    callback(null, true);
  } else {
    callback(new Error('Error: only ' + fileTypes + ' are allowed!'), false);
  }
}
@Controller('icons')
export class IconsController {
  constructor(private readonly iconsService: IconsService) {}

  @Get('')
  async getIcons(): Promise<IIcon[]> {
    return this.iconsService.getIcons();
  }

  @Get('versions')
  async getVersions(): Promise<IIconVersion[]> {
    return this.iconsService.getVersions();
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @UseInterceptors(AmazonS3FileInterceptor('icon', { fileFilter: fileFilter }))
  @Post('')
  async createIcon(
    @Body() createIconDTO: CreateIconDTO,
    @UploadedFile() file: IAWSUploadedFile,
  ): Promise<IIcon> {
    return this.iconsService.createIcon(createIconDTO, file);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put('update/:id')
  async updateIcon(
    @Param('id') id: string,
    @Body() updateIconDTO: UpdateIconDTO,
  ): Promise<IIcon> {
    return this.iconsService.updateIcon(id, updateIconDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put('variant/:id')
  async addVariant(
    @Param('id') id: string,
    @Body() changeVariantDTO: ChangeVariantDTO,
  ): Promise<IIcon> {
    return this.iconsService.addVariant(id, changeVariantDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete('variant/:id')
  async removeVariant(
    @Param('id') id: string,
    @Body() changeVariantDTO: ChangeVariantDTO,
  ): Promise<IIcon> {
    return this.iconsService.removeVariant(id, changeVariantDTO);
  }
}
