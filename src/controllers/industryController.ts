import { Request, Response } from 'express';
import { Industry } from '../models/Industry.js';
import { Funding } from '../models/Funding.js';
import { Project } from '../models/Project.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const IndustryController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const industries = await Industry.find();
      res.status(200).json({ success: true, data: industries });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getCSROpportunities(req: Request, res: Response): Promise<void> {
    try {
      // Projects seeking funding or pilots
      const projects = await Project.find({
        stage: { $in: ['Approved', 'Development', 'Prototype', 'Testing', 'Pilot'] },
      })
        .populate('challengeRef', 'title category location severity')
        .populate('leadFacultyRef', 'name')
        .populate('universityRef', 'name');

      res.status(200).json({ success: true, data: projects });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async pledgeFunding(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { projectId, amountINR, type, purpose, donorName } = req.body;
      if (!projectId || !amountINR) {
        res.status(400).json({ success: false, message: 'Project ID and amount are required.' });
        return;
      }

      const project = await Project.findById(projectId);
      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found.' });
        return;
      }

      const funding = await Funding.create({
        projectRef: project._id,
        donorName: donorName || req.user?.name || 'Industry Partner',
        amountINR,
        type: type || 'CSR',
        status: 'Pledged',
        purpose: purpose || 'CSR Support for Pilot Deployment',
      });

      project.fundingRaisedINR += amountINR;
      await project.save();

      res.status(201).json({
        success: true,
        message: 'Funding pledge submitted successfully.',
        data: funding,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
