import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Information {
  @Prop({ required: true, type: String })
  label: string;

  @Prop({ required: true, type: String })
  value: string;

  @Prop({ required: true, type: Number })
  order: number;
}

export const informationSchema = SchemaFactory.createForClass(Information);
