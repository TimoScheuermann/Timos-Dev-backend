import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_doc: TPFile, ret: TPFile) => {
      ret.src = ret.Location;
      delete ret._id;
      delete ret.__v;
      delete ret.originalname;
      delete ret.encoding;
      delete ret.mimetype;
      delete ret.ACL;
      delete ret.ETag;
      delete ret.Key;
      delete ret.Bucket;
      delete ret.premultiplied;
      delete ret.ContentType;
      delete ret.Location;
      return ret;
    },
  },
})
export class TPFile extends Document {
  // aws specific
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

  // custom
  @Prop()
  src: string;

  @Prop()
  name: string;

  @Prop()
  pinned: boolean;

  @Prop()
  created: number;

  @Prop()
  tags: string[];

  @Prop()
  folderId: string;
}

export const TPFileSchema = SchemaFactory.createForClass(TPFile);
