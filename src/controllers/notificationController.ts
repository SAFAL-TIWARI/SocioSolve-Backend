import { Request, Response } from 'express';
import { Notification } from '../models/Notification.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const NotificationController = {
  async getMyNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const notifications = await Notification.find({ recipientUserRef: req.user.id })
        .sort({ createdAt: -1 })
        .limit(25);

      const unreadCount = await Notification.countDocuments({ recipientUserRef: req.user.id, isRead: false });

      res.status(200).json({
        success: true,
        data: notifications,
        unreadCount,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async markAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await Notification.findByIdAndUpdate(id, { isRead: true });
      res.status(200).json({ success: true, message: 'Marked as read.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async markAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      await Notification.updateMany({ recipientUserRef: req.user.id }, { isRead: true });
      res.status(200).json({ success: true, message: 'All notifications marked as read.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
