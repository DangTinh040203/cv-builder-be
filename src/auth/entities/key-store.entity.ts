import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { User } from '@/user/entities/user.entity';

@Schema({ timestamps: true })
export class KeyStore {
  @Prop({ required: true, type: String, ref: User.name })
  userId: string;

  @Prop({ required: true })
  refreshToken: string;

  @Prop({ required: true, type: [String], default: [] })
  refreshTokenUsed: string[];
}

export const keyStoreSchema = SchemaFactory.createForClass(KeyStore);
