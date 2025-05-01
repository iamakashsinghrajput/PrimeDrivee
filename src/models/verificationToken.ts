import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IVerificationToken extends Document {
  email: string;
  token: string;
  createdAt: Date;
  expiresAt: Date;
}

const VerificationTokenSchema: Schema<IVerificationToken> = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
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

const VerificationToken: Model<IVerificationToken> =
    models.VerificationToken || mongoose.model<IVerificationToken>('VerificationToken', VerificationTokenSchema);

export default VerificationToken;