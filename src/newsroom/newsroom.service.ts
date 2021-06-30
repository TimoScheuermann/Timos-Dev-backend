import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { IProject } from 'src/project/interfaces/IProject.interface';
import { IProjectNewsroom } from 'src/project/interfaces/IProjectNewsroom.interface';
import { Project } from 'src/project/schemas/Project.schema';
import { CreateNewsDTO } from './dtos/CreateNews.dto';
import { UpdateNewsDTO } from './dtos/UpdateNews.dto';
import { INewsExtended } from './interfaces/INewsExtended.interface';
import { News } from './schemas/News.schema';

@Injectable()
export class NewsroomService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(News.name) private newsModel: Model<News>,
  ) {}

  public async createNews(
    createNewsDTO: CreateNewsDTO,
  ): Promise<INewsExtended> {
    const {
      content,
      project,
      timestamp,
      title,
      type,
      thumbnail,
    } = createNewsDTO;
    if (!thumbnail) {
      throw new UnprocessableEntityException('thumbnail missing');
    }
    if (!content) {
      throw new UnprocessableEntityException('content missing');
    }
    if (!project) {
      throw new UnprocessableEntityException('project missing');
    }
    if (!timestamp) {
      throw new UnprocessableEntityException('timestamp missing');
    }
    if (!title) {
      throw new UnprocessableEntityException('title missing');
    }
    if (!type) {
      throw new UnprocessableEntityException('type missing');
    }
    createNewsDTO.timestamp = +createNewsDTO.timestamp;

    const news = await this.newsModel.create(createNewsDTO);
    return (await this.mapNews([news]))[0];
  }

  public async deleteNews(id: string): Promise<void> {
    if (isValidObjectId(id)) {
      await this.newsModel.deleteOne({ _id: id });
    }
  }

  public async getNewsById(id: string): Promise<INewsExtended> {
    let news: News | null = null;
    if (!isValidObjectId(id)) {
      const reg = new RegExp(`${id}`, 'i');
      news = await this.newsModel.findOne({ title: reg });
    } else {
      news = await this.newsModel.findOne({ _id: id });
    }

    return (await this.mapNews([news]))[0];
  }

  public async getNewsByQuery(query: string): Promise<INewsExtended[]> {
    if (!query) {
      return this.getNews(null, null, null);
    }

    const reg = new RegExp(`${query}`, 'i');
    const news = await this.newsModel.find({
      $or: [
        { title: reg },
        { thumbnail: reg },
        { content: reg },
        { project: reg },
        { id: reg },
        { type: reg },
      ],
    });

    return await this.mapNews(news);
  }

  public async addFeatured(
    id: string,
    featured: string,
  ): Promise<INewsExtended> {
    if (!id || id.length === 0 || !isValidObjectId(id)) {
      throw new UnprocessableEntityException('incorrect id');
    }

    await this.newsModel.updateOne(
      { _id: id },
      { $set: { featured: featured } },
    );

    const news = await this.newsModel.findOne({ _id: id });
    return (await this.mapNews([news]))[0];
  }

  public async removeFeatured(id: string): Promise<INewsExtended> {
    if (!isValidObjectId(id)) {
      throw new UnprocessableEntityException('incorrect id');
    }

    await this.newsModel.updateOne({ _id: id }, { $unset: { featured: 1 } });

    const news = await this.newsModel.findOne({ _id: id });
    return (await this.mapNews([news]))[0];
  }

  public async updateNews(
    updateNewsDTO: UpdateNewsDTO,
  ): Promise<INewsExtended> {
    const { _id } = updateNewsDTO;

    if (!_id || _id.length === 0 || !isValidObjectId(_id)) {
      throw new UnprocessableEntityException('incorrect id');
    }

    await this.newsModel.updateOne({ _id: _id }, { $set: updateNewsDTO });

    const news = await this.newsModel.findOne({ _id: _id });
    return (await this.mapNews([news]))[0];
  }

  public async getAvailableProjects(): Promise<IProjectNewsroom[]> {
    const projects: IProject[] = await this.projectModel.find({
      website: { $exists: true },
    });
    return projects.map((x) => {
      return {
        _id: x._id,
        icon: x.icon,
        title: x.title,
        website: x.website,
      } as IProjectNewsroom;
    });
  }

  public async getNews(
    limit: number | null = 100000,
    project: string | null = null,
    skip: number | null = 0,
  ): Promise<INewsExtended[]> {
    let news: News[] = [];
    let projectFilter = null;

    if (project) {
      if (!isValidObjectId(project)) {
        const reg = new RegExp(`${project}`, 'i');
        const projectObj = await this.projectModel.findOne({ title: reg });

        if (!projectObj) return [];
        else project = projectObj._id;
      }
      projectFilter = { project: project };
    }
    news = await this.newsModel
      .find(projectFilter)
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(limit)
      .sort({ timestamp: -1 });

    return await this.mapNews(news);
  }

  public async getFeaturedNews(): Promise<any[]> {
    const newsValid = await this.newsModel.find({
      featured: { $exists: true },
    });

    return await this.mapNews(newsValid);
  }

  public async getRelevantProjects(): Promise<string[]> {
    const projectIds = await this.newsModel
      .aggregate([{ $sortByCount: '$project' }])
      .sort({ count: -1 });

    return Promise.all(
      projectIds.map(async (x) => {
        return (await this.projectModel.findOne({ _id: x._id })).title;
      }),
    );
  }

  private async mapNews(news: News[]): Promise<INewsExtended[]> {
    const projects: IProjectNewsroom[] = await this.getAvailableProjects();
    const projectlink = (id: string) =>
      projects.filter((x) => x._id + '' === id)[0];

    return news.map((x) => {
      return {
        content: x.content,
        project: projectlink(x.project),
        thumbnail: x.thumbnail,
        timestamp: x.timestamp,
        title: x.title,
        type: x.type,
        _id: x._id,
        featured: x.featured,
      } as INewsExtended;
    });
  }
}
