import mongoose, { Schema, Document } from 'mongoose';
import { VerificationChoice } from '../types/index.js';

export interface IResolutionVerification extends Document {
  challengeRef: mongoose.Types.ObjectId;
  citizenRef: mongoose.Types.ObjectId;
  verifiedStatus: VerificationChoice; // 'Yes' | 'Partially' | 'No'
  disputeReason?: string;
  citizenEvidenceUrls: string[];
  verifiedAt: Date;
}

const ResolutionVerificationSchema = new Schema<IResolutionVerification>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  citizenRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  verifiedStatus: { type: String, enum: ['Yes', 'Partially', 'No'], required: true },
  disputeReason: { type: String },
  citizenEvidenceUrls: [{ type: String }],
  verifiedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const ResolutionVerification = mongoose.model<IResolutionVerification>('ResolutionVerification', ResolutionVerificationSchema);
