import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  userRef: mongoose.Types.ObjectId;
  universityRef: mongoose.Types.ObjectId;
  rollNumber: string;
  department: string;
  degree: string;
  graduationYear: number;
  skills: string[];
  activeTeamId?: string;
  projectsCompleted: number;
}

const StudentSchema = new Schema<IStudent>({
  userRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
  universityRef: { type: Schema.Types.ObjectId, ref: 'University', required: true, index: true },
  rollNumber: { type: String, required: true },
  department: { type: String, required: true },
  degree: { type: String, required: true },
  graduationYear: { type: Number, required: true },
  skills: [{ type: String }],
  activeTeamId: { type: String },
  projectsCompleted: { type: Number, default: 0 },
}, { timestamps: true });

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
