import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreateWordDTO } from './dtos/CreateWord.dto';
import { UpdateWordDTO } from './dtos/UpdateWord.dto';
import { IWord } from './interfaces/IWord.interface';
import { Word } from './schemas/Word.schema';

@Injectable()
export class TranslatorService {
  constructor(@InjectModel(Word.name) private wordModel: Model<Word>) {}

  public async getWords(): Promise<IWord[]> {
    return await this.wordModel.find();
  }

  public async createWord(createWordDTO: CreateWordDTO): Promise<IWord> {
    const { acronym, description, meaning } = createWordDTO;

    if (!acronym || acronym.length === 0)
      throw new UnprocessableEntityException('acronym missing');

    if (!description || description.length === 0)
      throw new UnprocessableEntityException('description missing');

    if (!meaning || meaning.length === 0)
      throw new UnprocessableEntityException('meaning missing');

    return await this.wordModel.create(createWordDTO);
  }

  public async updateWord(updateWordDTO: UpdateWordDTO): Promise<IWord> {
    const { _id } = updateWordDTO;

    if (!_id || _id.length === 0 || !isValidObjectId(_id))
      throw new UnprocessableEntityException('_id missing');

    await this.wordModel.updateOne({ _id: _id }, { $set: updateWordDTO });

    return await this.wordModel.findOne({ _id: _id });
  }

  public async deleteWord(id: string): Promise<void> {
    if (id && id.length === 0 && !isValidObjectId(id)) {
      await this.wordModel.deleteOne({ _id: id });
    }
  }
}
