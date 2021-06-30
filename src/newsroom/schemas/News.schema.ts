import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class News extends Document {
  @Prop()
  title: string;

  @Prop()
  project: string;

  @Prop()
  type: 'update' | 'release' | 'feature';

  @Prop()
  timestamp: number;

  @Prop()
  content: string;

  @Prop()
  thumbnail: string;

  @Prop({ required: false })
  featured?: string;
}

export const NewsSchema = SchemaFactory.createForClass(News);
