import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Education {
  @Prop({ required: true })
  schoolName: string;

  @Prop({ required: true })
  degree: string;

  @Prop({ required: true })
  major: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: false, default: null })
  endDate: Date | null;

  @Prop({ required: true })
  order: number;
}

export const educationSchema = SchemaFactory.createForClass(Education);
