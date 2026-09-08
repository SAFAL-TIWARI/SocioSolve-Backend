import mongoose, { Schema, Document } from 'mongoose';

export interface IImpactMetric extends Document {
  projectRef?: mongoose.Types.ObjectId;
  challengeRef?: mongoose.Types.ObjectId;
  district: string;
  category: string;
  peopleBenefited: number;
  costSavedINR?: number;
  timeSavedHours?: number;
  waterSavedLiters?: number;
  wasteReducedKg?: number;
  co2OffsetKg?: number;
  metricNotes?: string;
  recordedAt: Date;
}

const ImpactMetricSchema = new Schema<IImpactMetric>({
  projectRef: { type: Schema.Types.ObjectId, ref: 'Project' },
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge' },
  district: { type: String, required: true, index: true },
  category: { type: String, required: true, index: true },
  peopleBenefited: { type: Number, default: 0 },
  costSavedINR: { type: Number, default: 0 },
  timeSavedHours: { type: Number, default: 0 },
  waterSavedLiters: { type: Number, default: 0 },
  wasteReducedKg: { type: Number, default: 0 },
  co2OffsetKg: { type: Number, default: 0 },
  metricNotes: { type: String },
  recordedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const ImpactMetric = mongoose.model<IImpactMetric>('ImpactMetric', ImpactMetricSchema);
