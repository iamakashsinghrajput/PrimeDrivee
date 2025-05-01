import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IOtp extends Document {
  email: string;
  otp: string;
  createdAt: Date;
  expiresAt: Date;
}

const OtpSchema: Schema<IOtp> = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '0s' }
  }
});


const Otp: Model<IOtp> = models.Otp || mongoose.model<IOtp>('Otp', OtpSchema);

export default Otp;