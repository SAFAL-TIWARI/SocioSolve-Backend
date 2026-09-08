import { Request, Response } from 'express';
import { Department } from '../models/Department.js';
import { Challenge } from '../models/Challenge.js';

export const DepartmentController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const departments = await Department.find().populate('nodalOfficerRef', 'name email phone');
      res.status(200).json({ success: true, data: departments });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getStats(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const department = await Department.findById(id);
      if (!department) {
        res.status(404).json({ success: false, message: 'Department not found.' });
        return;
      }

      const [totalAssigned, inProgress, resolved, overdue] = await Promise.all([
        Challenge.countDocuments({ assignedDeptRef: department._id }),
        Challenge.countDocuments({ assignedDeptRef: department._id, status: { $in: ['Assigned', 'Accepted', 'Solution Development', 'Pilot'] } }),
        Challenge.countDocuments({ assignedDeptRef: department._id, status: 'Resolved' }),
        Challenge.countDocuments({ assignedDeptRef: department._id, slaDueAt: { $lt: new Date() }, status: { $ne: 'Resolved' } }),
      ]);

      res.status(200).json({
        success: true,
        data: {
          department,
          stats: {
            totalAssigned,
            inProgress,
            resolved,
            overdue,
            resolutionRate: totalAssigned ? Math.round((resolved / totalAssigned) * 100) : 0,
          },
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
