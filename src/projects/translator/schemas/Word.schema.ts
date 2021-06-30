import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Word extends Document {
  @Prop()
  acronym: string;

  @Prop()
  meaning: string;

  @Prop()
  description: string;
}

export const WordSchema = SchemaFactory.createForClass(Word);
