import mongoose, { Schema, Document } from 'mongoose';

export interface IResolution extends Document {
  challengeRef: mongoose.Types.ObjectId;
  submittedByRef: mongoose.Types.ObjectId;
  beforePhotos: string[];
  afterPhotos: string[];
  explanation: string;
  fieldInspectionReport?: string;
  aiResolutionAssessment?: {
    likelyResolved: boolean;
    confidence: number;
    observations: string;
    requiresHumanVerification: boolean;
  };
  submittedAt: Date;
}

const ResolutionSchema = new Schema<IResolution>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  submittedByRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  beforePhotos: [{ type: String }],
  afterPhotos: [{ type: String }],
  explanation: { type: String, required: true },
  fieldInspectionReport: { type: String },
  aiResolutionAssessment: {
    likelyResolved: Boolean,
    confidence: Number,
    observations: String,
    requiresHumanVerification: { type: Boolean, default: true },
  },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Resolution = mongoose.model<IResolution>('Resolution', ResolutionSchema);
