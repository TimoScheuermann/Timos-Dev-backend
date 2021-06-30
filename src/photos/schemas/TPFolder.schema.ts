import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_doc: TPFolder, ret: TPFolder) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class TPFolder extends Document {
  @Prop()
  name: string;

  @Prop()
  color: string;

  @Prop()
  pinned: boolean;

  @Prop({ required: false })
  parent?: string;

  @Prop({ required: false })
  icon?: string;
}

export const TPFolderSchema = SchemaFactory.createForClass(TPFolder);
