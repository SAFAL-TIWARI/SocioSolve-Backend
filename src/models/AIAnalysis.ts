import mongoose, { Schema, Document } from 'mongoose';

export interface IAIAnalysis extends Document {
  challengeRef: mongoose.Types.ObjectId;
  detectedIssue: string;
  category: string;
  severity: string;
  confidence: number;
  summary: string;
  affectedDomain: string;
  suggestedDepartment: string;
  suggestedExpertise: string[];
  possibleImpact: string[];
  duplicateMatches: Array<{
    challengeId: string;
    title: string;
    similarity: string;
    distanceMeters?: number;
  }>;
  userCorrections?: {
    categoryChanged?: boolean;
    severityChanged?: boolean;
    finalCategory?: string;
    finalSeverity?: string;
  };
  rawModelOutput?: string;
  modelVersion: string;
  createdAt: Date;
}

const AIAnalysisSchema = new Schema<IAIAnalysis>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  detectedIssue: { type: String, required: true },
  category: { type: String, required: true },
  severity: { type: String, required: true },
  confidence: { type: Number, required: true },
  summary: { type: String, required: true },
  affectedDomain: { type: String, required: true },
  suggestedDepartment: { type: String, required: true },
  suggestedExpertise: [{ type: String }],
  possibleImpact: [{ type: String }],
  duplicateMatches: [{
    challengeId: String,
    title: String,
    similarity: String,
    distanceMeters: Number,
  }],
  userCorrections: {
    categoryChanged: Boolean,
    severityChanged: Boolean,
    finalCategory: String,
    finalSeverity: String,
  },
  rawModelOutput: { type: String },
  modelVersion: { type: String, default: 'gemini-1.5-flash' },
}, { timestamps: true });

export const AIAnalysis = mongoose.model<IAIAnalysis>('AIAnalysis', AIAnalysisSchema);
