import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  emailVerified?: Date | null;
  image?: string;
  gender?: 'male' | 'female' | 'other' | null;
  mobileNumber?: string | null;
  dob?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },
  password: {
    type: String,
  },
  emailVerified: {
    type: Date,
    default: null,
  },
  image: {
    type: String,
    default: null,
  },
  gender: {
    type: String,
    enum: {
        values: ['male', 'female', 'other', null],
        message: 'Gender must be one of male, female, other, or null'
    },
    default: null,
  },
  mobileNumber: {
    type: String,
    trim: true,
    default: null,
  },
  dob: {
    type: Date,
    default: null,
  }
}, { timestamps: true });
const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;