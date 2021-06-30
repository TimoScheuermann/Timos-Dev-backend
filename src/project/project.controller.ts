import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsGuard, TGroups } from 'src/auth/guards/TGroup.guard';
import { CreateProjectDTO } from './dtos/CreateProject.dto';
import { UpdateProjectDTO } from './dtos/UpdateProject.dto';
import { UpdateSectionsDTO } from './dtos/UpdateSections.dto';
import { IProject } from './interfaces/IProject.interface';
import { IProjectSection } from './interfaces/IProjectSection.interface';
import { ProjectService } from './project.service';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get('')
  async getProjects(): Promise<IProject[]> {
    return this.projectService.getProjects();
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Get('all')
  async getAllProjects(): Promise<IProject[]> {
    return this.projectService.getAllProjects();
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('')
  async createProject(
    @Body() createProjectDTO: CreateProjectDTO,
  ): Promise<string> {
    return this.projectService.createProject(createProjectDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete(':id')
  async deleteProject(@Param('id') id: string): Promise<void> {
    this.projectService.deleteProject(id);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put('')
  async updateProject(
    @Body() updateProjectDTO: UpdateProjectDTO,
  ): Promise<string> {
    return this.projectService.updateProject(updateProjectDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put('sections')
  async updateSections(
    @Body() updateSectionsDTO: UpdateSectionsDTO,
  ): Promise<IProjectSection[]> {
    return this.projectService.updateSections(updateSectionsDTO);
  }
}
