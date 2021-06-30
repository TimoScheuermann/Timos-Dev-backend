import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsGuard, TGroups } from 'src/auth/guards/TGroup.guard';
import { IProjectNewsroom } from 'src/project/interfaces/IProjectNewsroom.interface';
import { CreateNewsDTO } from './dtos/CreateNews.dto';
import { FeatureNewsDTO } from './dtos/FeatureNews.dto';
import { UpdateNewsDTO } from './dtos/UpdateNews.dto';
import { INewsExtended } from './interfaces/INewsExtended.interface';
import { NewsroomService } from './newsroom.service';

@Controller('newsroom')
export class NewsroomController {
  constructor(private readonly newsroomService: NewsroomService) {}

  @Get('')
  async getNews(
    @Query('limit') limit: number,
    @Query('project') project: string,
    @Query('skip') skip: number,
  ): Promise<INewsExtended[]> {
    return this.newsroomService.getNews(+limit, project, +skip);
  }

  @Get('news/:id')
  async getNewsById(@Param('id') id: string): Promise<INewsExtended | null> {
    return this.newsroomService.getNewsById(id);
  }

  @Get('search')
  async getNewsByQuery(
    @Query('query') query: string,
  ): Promise<INewsExtended[]> {
    return this.newsroomService.getNewsByQuery(query);
  }

  @Get('featured')
  async getFeaturedNews(): Promise<INewsExtended[]> {
    return this.newsroomService.getFeaturedNews();
  }

  @Get('projects')
  async getProjectsNewsroom(): Promise<IProjectNewsroom[]> {
    return this.newsroomService.getAvailableProjects();
  }

  @Get('projects/relevant')
  async getRelevantProjects(): Promise<string[]> {
    return this.newsroomService.getRelevantProjects();
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post()
  async createNews(
    @Body() createNewsDTO: CreateNewsDTO,
  ): Promise<INewsExtended> {
    return this.newsroomService.createNews(createNewsDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put()
  async updateNews(
    @Body() updateNewsDTO: UpdateNewsDTO,
  ): Promise<INewsExtended> {
    return this.newsroomService.updateNews(updateNewsDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put('featured/:id')
  async addFeatured(
    @Param('id') id: string,
    @Body() body: FeatureNewsDTO,
  ): Promise<INewsExtended> {
    return this.newsroomService.addFeatured(id, body.featured);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete('featured/:id')
  async removeFeatured(@Param('id') id: string): Promise<INewsExtended> {
    return this.newsroomService.removeFeatured(id);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete(':id')
  async deleteNews(@Param('id') id: string): Promise<void> {
    return this.newsroomService.deleteNews(id);
  }
}
