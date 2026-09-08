import mongoose, { Schema, Document } from 'mongoose';

export interface IDepartment extends Document {
  name: string;
  code: string;
  domain: string;
  state: string;
  jurisdictionDistricts: string[];
  nodalOfficerRef?: mongoose.Types.ObjectId;
  slaDaysDefault: number;
  activeChallengesCount: number;
  resolvedChallengesCount: number;
}

const DepartmentSchema = new Schema<IDepartment>({
  name: { type: String, required: true, unique: true, index: true },
  code: { type: String, required: true, unique: true },
  domain: { type: String, required: true, index: true },
  state: { type: String, default: 'Jharkhand' },
  jurisdictionDistricts: [{ type: String }],
  nodalOfficerRef: { type: Schema.Types.ObjectId, ref: 'User' },
  slaDaysDefault: { type: Number, default: 7 },
  activeChallengesCount: { type: Number, default: 0 },
  resolvedChallengesCount: { type: Number, default: 0 },
}, { timestamps: true });

export const Department = mongoose.model<IDepartment>('Department', DepartmentSchema);
