import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterExtendedModule } from 'nestjs-multer-aws';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';
import { AWSFile, AWSFileSchema } from './schemas/AWSFile.schema';

@Module({
  controllers: [DriveController],
  providers: [DriveService],
  imports: [
    MongooseModule.forFeature([{ name: AWSFile.name, schema: AWSFileSchema }]),
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
          basePath: 'drive',
          fileSize: '250KB',
        };
      },
    }),
  ],
})
export class DriveModule {}
