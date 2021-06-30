import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterExtendedModule } from 'nestjs-multer-aws';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { TPFile, TPFileSchema } from './schemas/TPFile.schema';
import { TPFolder, TPFolderSchema } from './schemas/TPFolder.schema';

@Module({
  imports: [
    MulterExtendedModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          awsConfig: {
            accessKeyId: configService.get('AWS_ACCESS_KEY'),
            secretAccessKey: configService.get('AWS_SECRET'),
            region: configService.get('AWS_REGION'),
          },
          bucket: configService.get('AWS_BUCKET'),
          basePath: 'lib',
          fileSize: '10MB',
        };
      },
    }),
    MongooseModule.forFeature([
      { name: TPFolder.name, schema: TPFolderSchema },
      { name: TPFile.name, schema: TPFileSchema },
    ]),
  ],
  controllers: [PhotosController],
  providers: [PhotosService],
})
export class PhotosModule {}
