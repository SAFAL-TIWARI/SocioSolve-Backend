import mongoose, { Schema, Document } from 'mongoose';

export interface IFaculty extends Document {
  userRef: mongoose.Types.ObjectId;
  universityRef: mongoose.Types.ObjectId;
  name: string;
  designation: string;
  department: string;
  expertiseAreas: string[];
  researchKeywords: string[];
  publicationsCount: number;
  patentsCount: number;
  activeMentorships: number;
  isAvailableForMentorship: boolean;
}

const FacultySchema = new Schema<IFaculty>({
  userRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  universityRef: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
  name: { type: String, required: true },
  designation: { type: String, required: true },
  department: { type: String, required: true },
  expertiseAreas: [{ type: String }],
  researchKeywords: [{ type: String }],
  publicationsCount: { type: Number, default: 0 },
  patentsCount: { type: Number, default: 0 },
  activeMentorships: { type: Number, default: 0 },
  isAvailableForMentorship: { type: Boolean, default: true },
}, { timestamps: true });

export const Faculty = mongoose.model<IFaculty>('Faculty', FacultySchema);
