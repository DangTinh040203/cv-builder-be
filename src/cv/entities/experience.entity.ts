import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Experience {
  @Prop({ required: true })
  startDate: Date;

  @Prop()
  endDate: Date | null;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  position: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  order: number;
}

export const experienceSchema = SchemaFactory.createForClass(Experience);
