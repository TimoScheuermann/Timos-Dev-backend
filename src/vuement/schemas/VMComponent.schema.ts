import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { VMProp } from '../models/VMProp.model';

@Schema({
  toJSON: {
    virtuals: true,
    transform: (_doc: VMComponent, ret: VMComponent) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class VMComponent extends Document {
  @Prop()
  name: string;

  @Prop({ required: false })
  image?: string;

  @Prop()
  children: string[];

  @Prop({ required: false })
  isChild?: boolean;

  @Prop()
  props: VMProp[];
}

export const VMComponentSchema = SchemaFactory.createForClass(VMComponent);
