import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
export class UtilsService {
  static convertToObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }
}
