import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DriveModule } from './drive/drive.module';
import { NewsroomModule } from './newsroom/newsroom.module';
import { ProjectModule } from './project/project.module';
import { IconsModule } from './projects/icons/icons.module';
import { TranslatorModule } from './projects/translator/translator.module';
import { UserModule } from './user/user.module';
import { PhotosModule } from './photos/photos.module';
import { VuementModule } from './vuement/vuement.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          uri: `mongodb+srv://${configService.get(
            'MONGO_USER',
          )}:${configService.get('MONGO_PW')}@${configService.get(
            'MONGO_DB',
          )}/${configService.get('MONGO_TABLE')}?retryWrites=true&w=majority`,
        };
      },
    }),
    AuthModule,
    UserModule,
    NewsroomModule,
    ProjectModule,
    TranslatorModule,
    IconsModule,
    DriveModule,
    PhotosModule,
    VuementModule,
  ],
})
export class AppModule {}
