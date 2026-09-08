import mongoose, { Schema, Document } from 'mongoose';

export interface IFunding extends Document {
  projectRef: mongoose.Types.ObjectId;
  donorOrgRef: mongoose.Types.ObjectId;
  donorName: string;
  amountINR: number;
  type: 'CSR' | 'Govt Grant' | 'Incubation Seed' | 'Industry Sponsorship';
  status: 'Pledged' | 'Approved' | 'Disbursed';
  purpose: string;
  disbursedDate?: Date;
}

const FundingSchema = new Schema<IFunding>({
  projectRef: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  donorOrgRef: { type: Schema.Types.ObjectId, ref: 'Organization' },
  donorName: { type: String, required: true },
  amountINR: { type: Number, required: true },
  type: {
    type: String,
    enum: ['CSR', 'Govt Grant', 'Incubation Seed', 'Industry Sponsorship'],
    default: 'CSR',
  },
  status: { type: String, enum: ['Pledged', 'Approved', 'Disbursed'], default: 'Pledged' },
  purpose: { type: String, required: true },
  disbursedDate: { type: Date },
}, { timestamps: true });

export const Funding = mongoose.model<IFunding>('Funding', FundingSchema);
