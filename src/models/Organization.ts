import mongoose, { Schema, Document } from 'mongoose';

export interface IOrganization extends Document {
  name: string;
  type: 'government_dept' | 'university' | 'industry' | 'startup' | 'msme' | 'csr';
  registrationNumber?: string;
  state: string;
  district: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  contactEmail: string;
  contactPhone?: string;
  website?: string;
  description?: string;
  capabilities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, trim: true, index: true },
  type: {
    type: String,
    enum: ['government_dept', 'university', 'industry', 'startup', 'msme', 'csr'],
    required: true,
    index: true,
  },
  registrationNumber: { type: String },
  state: { type: String, default: 'Jharkhand' },
  district: { type: String, required: true, index: true },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'verified',
  },
  contactEmail: { type: String, required: true },
  contactPhone: { type: String },
  website: { type: String },
  description: { type: String },
  capabilities: [{ type: String }],
}, { timestamps: true });

export const Organization = mongoose.model<IOrganization>('Organization', OrganizationSchema);
