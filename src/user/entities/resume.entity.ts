import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Information, type Section } from '@/lib/types/resume';
import { User } from '@/user/entities/user.entity';

@Schema({ timestamps: true })
export class Resume {
  @Prop({ required: true, ref: User.name })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subTitle: string;

  @Prop({ type: String, default: null })
  avatar: string | null;

  @Prop({ default: '' })
  overview: string;

  @Prop({ type: Array, default: [] })
  information: Information[];

  @Prop({ type: Object })
  section: Partial<Section>;
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);
