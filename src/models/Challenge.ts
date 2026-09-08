import mongoose, { Schema, Document } from 'mongoose';
import { ChallengeSeverity, ChallengeStatus, GeoLocation } from '../types/index.js';

export interface IChallenge extends Document {
  challengeId: string; // e.g. JH-2026-000123
  title: string;
  description: string;
  category: string;
  subcategory?: string;
  severity: ChallengeSeverity;
  urgency: 'Low' | 'Medium' | 'High' | 'Immediate';
  status: ChallengeStatus;
  location: GeoLocation;
  affectedCount: number;
  safetyRisk: boolean;
  durationMonths?: number;
  whoIsAffected?: string;
  evidenceUrls: string[];
  citizenRef: mongoose.Types.ObjectId;
  assignedDeptRef?: mongoose.Types.ObjectId;
  assignedOfficerRef?: mongoose.Types.ObjectId;
  leadUniversityRef?: mongoose.Types.ObjectId;
  leadIndustryRef?: mongoose.Types.ObjectId;
  slaDueAt?: Date;
  escalationLevel: number; // 0 = none, 1-4 = level
  citizenValidationCount: number;
  confirmationCount: number;
  aiConfidence?: number;
  aiSuggestedDept?: string;
  aiSuggestedKeywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>({
  challengeId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium',
    index: true,
  },
  urgency: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Immediate'],
    default: 'Medium',
  },
  status: {
    type: String,
    enum: [
      'Submitted', 'Under Review', 'Validated', 'Assigned', 'Accepted',
      'Solution Development', 'Pilot', 'Implementation', 'Resolution Submitted',
      'Citizen Verification', 'Resolved', 'Rejected', 'Duplicate',
      'Needs More Information', 'Reopened', 'Escalated'
    ],
    default: 'Submitted',
    index: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    coordinates: {
      type: [Number], // [lng, lat]
      required: true,
    },
    district: { type: String, required: true, index: true },
    block: { type: String },
    villageOrWard: { type: String },
    landmark: { type: String },
    address: { type: String },
  },
  affectedCount: { type: Number, default: 1 },
  safetyRisk: { type: Boolean, default: false },
  durationMonths: { type: Number, default: 1 },
  whoIsAffected: { type: String },
  evidenceUrls: [{ type: String }],
  citizenRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  assignedDeptRef: { type: Schema.Types.ObjectId, ref: 'Department', index: true },
  assignedOfficerRef: { type: Schema.Types.ObjectId, ref: 'User' },
  leadUniversityRef: { type: Schema.Types.ObjectId, ref: 'University' },
  leadIndustryRef: { type: Schema.Types.ObjectId, ref: 'Industry' },
  slaDueAt: { type: Date, index: true },
  escalationLevel: { type: Number, default: 0, index: true },
  citizenValidationCount: { type: Number, default: 0 },
  confirmationCount: { type: Number, default: 0 },
  aiConfidence: { type: Number },
  aiSuggestedDept: { type: String },
  aiSuggestedKeywords: [{ type: String }],
}, { timestamps: true });

ChallengeSchema.index({ 'location.coordinates': '2dsphere' });
ChallengeSchema.index({ category: 1, status: 1, severity: 1 });

export const Challenge = mongoose.model<IChallenge>('Challenge', ChallengeSchema);
