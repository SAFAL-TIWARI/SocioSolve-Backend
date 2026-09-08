import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../types/index.js';

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  passwordHash: string;
  role: UserRole;
  district?: string;
  designation?: string;
  institutionName?: string;
  departmentName?: string;
  organizationRef?: mongoose.Types.ObjectId;
  isVerified: boolean;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  phone: { type: String, trim: true },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: ['citizen', 'government', 'university', 'industry', 'admin'],
    default: 'citizen',
    index: true,
  },
  district: { type: String, index: true },
  designation: { type: String },
  institutionName: { type: String },
  departmentName: { type: String },
  organizationRef: { type: Schema.Types.ObjectId, ref: 'Organization' },
  isVerified: { type: Boolean, default: false },
  avatarUrl: { type: String },
}, { timestamps: true });

export const User = mongoose.model<IUser>('User', UserSchema);
