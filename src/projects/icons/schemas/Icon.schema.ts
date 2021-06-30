import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Icon extends Document {
  @Prop()
  name: string;

  @Prop()
  versionMajor: number;

  @Prop()
  versionMinor: number;

  @Prop()
  originalname: string;

  @Prop()
  encoding: string;

  @Prop()
  mimetype: string;

  @Prop()
  ACL: string;

  @Prop()
  ETag: string;

  @Prop()
  Location: string;

  @Prop()
  Key: string;

  @Prop()
  Bucket: string;

  @Prop()
  width: number;

  @Prop()
  height: number;

  @Prop()
  premultiplied: boolean;

  @Prop()
  size: number;

  @Prop()
  ContentType: string;
}

export const IconSchema = SchemaFactory.createForClass(Icon);
