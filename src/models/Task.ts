import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  projectRef: mongoose.Types.ObjectId;
  milestoneRef?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  assigneeRef?: mongoose.Types.ObjectId;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  status: 'Backlog' | 'In Progress' | 'Review' | 'Testing' | 'Pilot' | 'Completed';
  dueDate?: Date;
}

const TaskSchema = new Schema<ITask>({
  projectRef: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  milestoneRef: { type: Schema.Types.ObjectId, ref: 'Milestone' },
  title: { type: String, required: true },
  description: { type: String },
  assigneeRef: { type: Schema.Types.ObjectId, ref: 'User' },
  priority: { type: String, enum: ['Low', 'Medium', 'High', 'Urgent'], default: 'Medium' },
  status: {
    type: String,
    enum: ['Backlog', 'In Progress', 'Review', 'Testing', 'Pilot', 'Completed'],
    default: 'Backlog',
    index: true,
  },
  dueDate: { type: Date },
}, { timestamps: true });

export const Task = mongoose.model<ITask>('Task', TaskSchema);
