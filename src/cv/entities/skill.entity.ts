import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Skill {
  @Prop()
  label: string;

  @Prop()
  value: string;
}

export const skillSchema = SchemaFactory.createForClass(Skill);
