import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Provider } from 'src/auth/Provider.enum';

@Schema()
export class User extends Document {
  @Prop()
  thirdPartyId: string;

  @Prop()
  provider: Provider;

  @Prop()
  group: string;

  @Prop()
  username: string;

  @Prop()
  avatar: string;

  @Prop()
  firstLogin: number;

  @Prop()
  lastLogin: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
