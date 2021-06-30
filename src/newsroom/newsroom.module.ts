import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from 'src/project/schemas/Project.schema';
import { NewsroomController } from './newsroom.controller';
import { NewsroomService } from './newsroom.service';
import { News, NewsSchema } from './schemas/News.schema';

@Module({
  controllers: [NewsroomController],
  providers: [NewsroomService],
  imports: [
    MongooseModule.forFeature([
      { name: News.name, schema: NewsSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
})
export class NewsroomModule {}
