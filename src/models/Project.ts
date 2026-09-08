import mongoose, { Schema, Document } from 'mongoose';
import { ProjectStage } from '../types/index.js';

export interface IProject extends Document {
  projectCode: string; // e.g. PRJ-JH-2026-0042
  challengeRef: mongoose.Types.ObjectId;
  title: string;
  problemStatement: string;
  objective: string;
  expectedOutcome: string;
  technologyUsed: string[];
  stage: ProjectStage;
  leadFacultyRef?: mongoose.Types.ObjectId;
  universityRef?: mongoose.Types.ObjectId;
  studentMembers: Array<{
    userRef: mongoose.Types.ObjectId;
    name: string;
    role: string;
  }>;
  govtStakeholderRef?: mongoose.Types.ObjectId;
  industryPartnerRef?: mongoose.Types.ObjectId;
  totalBudgetINR: number;
  fundingRaisedINR: number;
  milestonesCount: number;
  completedMilestonesCount: number;
  progressPercent: number;
  pilotLocationDistrict?: string;
  impactPassportGenerated: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>({
  projectCode: { type: String, required: true, unique: true, index: true },
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  title: { type: String, required: true, index: true },
  problemStatement: { type: String, required: true },
  objective: { type: String, required: true },
  expectedOutcome: { type: String, required: true },
  technologyUsed: [{ type: String }],
  stage: {
    type: String,
    enum: [
      'Proposal', 'Review', 'Approved', 'Team Formation', 'Development',
      'Prototype', 'Testing', 'Pilot', 'Deployment', 'Impact Measurement', 'Completed'
    ],
    default: 'Proposal',
    index: true,
  },
  leadFacultyRef: { type: Schema.Types.ObjectId, ref: 'User' },
  universityRef: { type: Schema.Types.ObjectId, ref: 'University', index: true },
  studentMembers: [{
    userRef: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    role: String,
  }],
  govtStakeholderRef: { type: Schema.Types.ObjectId, ref: 'User' },
  industryPartnerRef: { type: Schema.Types.ObjectId, ref: 'Industry' },
  totalBudgetINR: { type: Number, default: 0 },
  fundingRaisedINR: { type: Number, default: 0 },
  milestonesCount: { type: Number, default: 0 },
  completedMilestonesCount: { type: Number, default: 0 },
  progressPercent: { type: Number, default: 0 },
  pilotLocationDistrict: { type: String },
  impactPassportGenerated: { type: Boolean, default: false },
}, { timestamps: true });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);
