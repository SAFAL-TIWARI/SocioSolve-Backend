import mongoose, { Schema, Document } from 'mongoose';

export interface IMilestone extends Document {
  projectRef: mongoose.Types.ObjectId;
  title: string;
  description: string;
  targetDate: Date;
  completionDate?: Date;
  status: 'Pending' | 'In Progress' | 'Review' | 'Completed';
  deliverables: string[];
  evidenceUrls: string[];
  progressPercent: number;
}

const MilestoneSchema = new Schema<IMilestone>({
  projectRef: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  targetDate: { type: Date, required: true },
  completionDate: { type: Date },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Review', 'Completed'],
    default: 'Pending',
    index: true,
  },
  deliverables: [{ type: String }],
  evidenceUrls: [{ type: String }],
  progressPercent: { type: Number, default: 0 },
}, { timestamps: true });

export const Milestone = mongoose.model<IMilestone>('Milestone', MilestoneSchema);
