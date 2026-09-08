import mongoose, { Schema, Document } from 'mongoose';

export interface IChallengeEvidence extends Document {
  challengeRef: mongoose.Types.ObjectId;
  fileUrl: string;
  fileType: 'image' | 'video' | 'pdf' | 'document';
  filename: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: mongoose.Types.ObjectId;
  caption?: string;
  createdAt: Date;
}

const ChallengeEvidenceSchema = new Schema<IChallengeEvidence>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, enum: ['image', 'video', 'pdf', 'document'], default: 'image' },
  filename: { type: String, required: true },
  fileSize: { type: Number, required: true },
  mimeType: { type: String, required: true },
  uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  caption: { type: String },
}, { timestamps: true });

export const ChallengeEvidence = mongoose.model<IChallengeEvidence>('ChallengeEvidence', ChallengeEvidenceSchema);
