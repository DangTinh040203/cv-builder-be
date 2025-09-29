import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

export enum AuthProvider {
  local = 'local',
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

  @Prop({ default: AuthProvider.local, enum: AuthProvider })
  provider: AuthProvider;
}

export const AccountSchema = SchemaFactory.createForClass(Account);
