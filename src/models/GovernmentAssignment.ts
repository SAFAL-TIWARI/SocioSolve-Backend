import mongoose, { Schema, Document } from 'mongoose';

export interface IGovernmentAssignment extends Document {
  challengeRef: mongoose.Types.ObjectId;
  departmentRef: mongoose.Types.ObjectId;
  assignedOfficerRef?: mongoose.Types.ObjectId;
  assignedByRef: mongoose.Types.ObjectId;
  priority: 'Routine' | 'High' | 'Emergency';
  instructions?: string;
  status: 'Assigned' | 'Acknowledged' | 'Action_Initiated' | 'Completed' | 'Reassigned';
  acknowledgedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GovernmentAssignmentSchema = new Schema<IGovernmentAssignment>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  departmentRef: { type: Schema.Types.ObjectId, ref: 'Department', required: true, index: true },
  assignedOfficerRef: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedByRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  priority: { type: String, enum: ['Routine', 'High', 'Emergency'], default: 'Routine' },
  instructions: { type: String },
  status: {
    type: String,
    enum: ['Assigned', 'Acknowledged', 'Action_Initiated', 'Completed', 'Reassigned'],
    default: 'Assigned',
    index: true,
  },
  acknowledgedAt: { type: Date },
  completedAt: { type: Date },
}, { timestamps: true });

export const GovernmentAssignment = mongoose.model<IGovernmentAssignment>('GovernmentAssignment', GovernmentAssignmentSchema);
