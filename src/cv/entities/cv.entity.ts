import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Information } from '@/cv/entities/information.entity';
import { User } from '@/user/entities/user.entity';

@Schema({ timestamps: true })
export class CV {
  @Prop({ required: true, type: String, ref: User.name })
  userId: string;

  @Prop({ required: true, type: String })
  avatar: string;

  @Prop({ required: true, type: Array<Information>, default: [] })
  information: Information[];

  @Prop({ required: true, type: String, default: '' })
  overview: string;

  @Prop({ required: true, type: String })
  heading: string;

  @Prop({ required: true, type: String })
  subHeading: string;

  @Prop({ required: true, type: Date })
  lastEdited: Date;

  @Prop({ required: true, type: Date })
  createdAt: Date;
}

export const cvSchema = SchemaFactory.createForClass(CV);
