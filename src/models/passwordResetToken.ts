import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IPasswordResetToken extends Document {
  email: string;
  token: string;
  expiresAt: Date;
}

const PasswordResetTokenSchema: Schema<IPasswordResetToken> = new Schema({
  email: {
    type: String,
    required: true,
    index: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: '0s' }
  }
});

const PasswordResetToken: Model<IPasswordResetToken> =
  models.PasswordResetToken || mongoose.model<IPasswordResetToken>('PasswordResetToken', PasswordResetTokenSchema);

export default PasswordResetToken;