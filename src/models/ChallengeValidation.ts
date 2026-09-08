import mongoose, { Schema, Document } from 'mongoose';

export interface IChallengeValidation extends Document {
  challengeRef: mongoose.Types.ObjectId;
  userRef: mongoose.Types.ObjectId;
  type: 'affected' | 'confirm';
  comments?: string;
  evidenceUrls: string[];
  createdAt: Date;
}

const ChallengeValidationSchema = new Schema<IChallengeValidation>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  userRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['affected', 'confirm'], required: true },
  comments: { type: String },
  evidenceUrls: [{ type: String }],
}, { timestamps: true });

ChallengeValidationSchema.index({ challengeRef: 1, userRef: 1, type: 1 }, { unique: true });

export const ChallengeValidation = mongoose.model<IChallengeValidation>('ChallengeValidation', ChallengeValidationSchema);
