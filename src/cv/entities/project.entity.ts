import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Information } from '@/cv/entities/information.entity';

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  subTitle: string;

  @Prop({ required: true, type: [Information], default: [] })
  information: Information[];

  @Prop({ required: true })
  order: number;
}

export const projectSchema = SchemaFactory.createForClass(Project);
