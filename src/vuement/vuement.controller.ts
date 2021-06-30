import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GroupsGuard, TGroups } from 'src/auth/guards/TGroup.guard';
import { CreateVMComponentDTO } from './dtos/CreateVMComponent.dto';
import { VMComponent } from './schemas/VMComponent.schema';
import { VuementService } from './vuement.service';

@Controller('vuement')
export class VuementController {
  constructor(private readonly vuementService: VuementService) {}

  @Get('components')
  async getComponents(): Promise<VMComponent[]> {
    return this.vuementService.getComponents();
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('component')
  async createComponent(
    @Body() dto: CreateVMComponentDTO,
  ): Promise<VMComponent> {
    return this.vuementService.createComponent(dto);
  }

  @TGroups(['admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Patch('component/:id')
  async patchComponent(
    @Param('id') id: string,
    @Body() dto: CreateVMComponentDTO,
  ): Promise<VMComponent> {
    return this.vuementService.patchComponent(id, dto);
  }
}
