import mongoose, { Schema, Document } from 'mongoose';

export interface IEscalation extends Document {
  challengeRef: mongoose.Types.ObjectId;
  level: number; // 1 to 4
  levelTitle: string; // e.g. "Department Supervisor", "District Authority"
  reason: string;
  triggeredBy: 'automatic_sla_breach' | 'manual_officer' | 'citizen_dispute';
  responsibleAuthority: string;
  actionRequired: string;
  status: 'Open' | 'Under Review' | 'Resolved';
  resolutionNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EscalationSchema = new Schema<IEscalation>({
  challengeRef: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true, index: true },
  level: { type: Number, required: true, min: 1, max: 4, index: true },
  levelTitle: { type: String, required: true },
  reason: { type: String, required: true },
  triggeredBy: {
    type: String,
    enum: ['automatic_sla_breach', 'manual_officer', 'citizen_dispute'],
    default: 'automatic_sla_breach',
  },
  responsibleAuthority: { type: String, required: true },
  actionRequired: { type: String, required: true },
  status: { type: String, enum: ['Open', 'Under Review', 'Resolved'], default: 'Open', index: true },
  resolutionNotes: { type: String },
}, { timestamps: true });

export const Escalation = mongoose.model<IEscalation>('Escalation', EscalationSchema);
