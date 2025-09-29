import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export enum AuthProvider {
  credential = 'credential',
  google = 'google',
  facebook = 'facebook',
  github = 'github',
}

@Schema({ timestamps: true })
export class Account {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false })
  password?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: AuthProvider.credential, enum: AuthProvider })
  provider: AuthProvider;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
