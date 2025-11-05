import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { Information } from '@/cv/entities/information.entity';

@Schema({ timestamps: true })
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date | null;

  @Prop({ required: true, type: [Information], default: [] })
  information: Array<Information>;

  @Prop({ required: true })
  order: number;
}

export const projectSchema = SchemaFactory.createForClass(Project);
