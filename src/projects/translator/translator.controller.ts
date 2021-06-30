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
import { CreateWordDTO } from './dtos/CreateWord.dto';
import { UpdateWordDTO } from './dtos/UpdateWord.dto';
import { IWord } from './interfaces/IWord.interface';
import { TranslatorService } from './translator.service';

@Controller('translator')
export class TranslatorController {
  constructor(private readonly translatorService: TranslatorService) {}

  @Get('')
  async getWords(): Promise<IWord[]> {
    return this.translatorService.getWords();
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Post('')
  async createWord(@Body() createWordDTO: CreateWordDTO): Promise<IWord> {
    return this.translatorService.createWord(createWordDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Put('')
  async updateWord(@Body() updateWordDTO: UpdateWordDTO): Promise<IWord> {
    return this.translatorService.updateWord(updateWordDTO);
  }

  @TGroups(['Admin'])
  @UseGuards(AuthGuard('jwt'), GroupsGuard)
  @Delete(':id')
  async deleteWord(@Param('id') id: string): Promise<void> {
    this.translatorService.deleteWord(id);
  }
}
