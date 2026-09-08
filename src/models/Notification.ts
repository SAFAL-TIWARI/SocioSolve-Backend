import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipientUserRef: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'challenge' | 'assignment' | 'sla' | 'project' | 'funding' | 'resolution' | 'system';
  deepLink?: string;
  isRead: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  recipientUserRef: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: {
    type: String,
    enum: ['challenge', 'assignment', 'sla', 'project', 'funding', 'resolution', 'system'],
    default: 'challenge',
    index: true,
  },
  deepLink: { type: String },
  isRead: { type: Boolean, default: false, index: true },
}, { timestamps: true });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
