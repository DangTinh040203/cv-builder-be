import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument } from 'mongoose';

export type ResumeDocument = HydratedDocument<ResumeSchema>;

@Schema({ collection: 'resumes', timestamps: true })
export class ResumeSchema {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  createdAt?: Date;

  @Prop()
  updatedAt?: Date;
}

export const ResumeMongoSchema = SchemaFactory.createForClass(ResumeSchema);
