import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

import { CV } from '@/cv/entities/cv.entity';

@Schema({ timestamps: true })
export class CVSection<T> {
  @Prop({ required: true, type: String, ref: CV.name })
  cvId: string;

  @Prop({ required: true, type: Array<T> })
  items: Array<T>;
}

export const cvSectionSchema = SchemaFactory.createForClass(CVSection);
