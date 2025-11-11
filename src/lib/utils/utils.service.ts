import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import mongoose from 'mongoose';

@Injectable()
export class UtilsService {
  convertToObjectId(id: string): mongoose.Types.ObjectId {
    return new mongoose.Types.ObjectId(id);
  }

  generateSecureOtp(length: number = 6) {
    const buffer = crypto.randomBytes(3);
    const otp = buffer.readUIntBE(0, 3) % 1000000;
    return otp.toString().padStart(length, '0');
  }
}
