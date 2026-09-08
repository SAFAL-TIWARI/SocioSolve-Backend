import mongoose, { Schema, Document } from 'mongoose';

export interface IIndustry extends Document {
  organizationName: string;
  type: 'Industry' | 'Startup' | 'MSME' | 'CSR' | 'Research Lab' | 'Innovation Hub';
  state: string;
  district: string;
  domainFocus: string[];
  csrBudgetAvailableINR?: number;
  csrProjectsCount: number;
  techSupportOfferings: string[];
  contactPerson: string;
  contactEmail: string;
  verificationStatus: 'verified' | 'pending';
}

const IndustrySchema = new Schema<IIndustry>({
  organizationName: { type: String, required: true, unique: true, index: true },
  type: {
    type: String,
    enum: ['Industry', 'Startup', 'MSME', 'CSR', 'Research Lab', 'Innovation Hub'],
    required: true,
    index: true,
  },
  state: { type: String, default: 'Jharkhand' },
  district: { type: String, required: true },
  domainFocus: [{ type: String }],
  csrBudgetAvailableINR: { type: Number, default: 0 },
  csrProjectsCount: { type: Number, default: 0 },
  techSupportOfferings: [{ type: String }],
  contactPerson: { type: String, required: true },
  contactEmail: { type: String, required: true },
  verificationStatus: { type: String, enum: ['verified', 'pending'], default: 'verified' },
}, { timestamps: true });

export const Industry = mongoose.model<IIndustry>('Industry', IndustrySchema);
