import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  entityType: 'challenge' | 'project' | 'milestone';
  entityId: string;
  authorRef: mongoose.Types.ObjectId;
  authorName: string;
  authorRole: string;
  content: string;
  attachments: string[];
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  entityType: { type: String, enum: ['challenge', 'project', 'milestone'], required: true, index: true },
  entityId: { type: String, required: true, index: true },
  authorRef: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  content: { type: String, required: true },
  attachments: [{ type: String }],
}, { timestamps: true });

export const Comment = mongoose.model<IComment>('Comment', CommentSchema);
