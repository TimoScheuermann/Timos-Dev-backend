import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Word, WordSchema } from './schemas/Word.schema';
import { TranslatorController } from './translator.controller';
import { TranslatorService } from './translator.service';

@Module({
  controllers: [TranslatorController],
  providers: [TranslatorService],
  imports: [
    MongooseModule.forFeature([{ name: Word.name, schema: WordSchema }]),
  ],
})
export class TranslatorModule {}
