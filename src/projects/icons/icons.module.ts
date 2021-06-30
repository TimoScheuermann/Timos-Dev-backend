import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterExtendedModule } from 'nestjs-multer-aws';
import { IconsController } from './icons.controller';
import { IconsService } from './icons.service';
import { Icon, IconSchema } from './schemas/Icon.schema';

@Module({
  controllers: [IconsController],
  providers: [IconsService],
  imports: [
    MongooseModule.forFeature([{ name: Icon.name, schema: IconSchema }]),
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
          basePath: 'timos-icons',
          fileSize: '250KB',
        };
      },
    }),
  ],
})
export class IconsModule {}
