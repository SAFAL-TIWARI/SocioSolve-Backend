import { Request, Response } from 'express';
import { Project } from '../models/Project.js';
import { Milestone } from '../models/Milestone.js';
import { Task } from '../models/Task.js';
import { Challenge } from '../models/Challenge.js';
import { ImpactMetric } from '../models/ImpactMetric.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const ProjectController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const { stage, universityId, category } = req.query;
      const query: any = {};
      if (stage) query.stage = stage;
      if (universityId) query.universityRef = universityId;

      const projects = await Project.find(query)
        .populate('challengeRef', 'challengeId title category severity location')
        .populate('leadFacultyRef', 'name email')
        .populate('universityRef', 'name code')
        .populate('industryPartnerRef', 'organizationName');

      res.status(200).json({ success: true, data: projects });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const project = await Project.findById(id)
        .populate('challengeRef')
        .populate('leadFacultyRef', 'name email')
        .populate('universityRef', 'name code location')
        .populate('industryPartnerRef', 'organizationName contactPerson');

      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found.' });
        return;
      }

      const [milestones, tasks, impactMetrics] = await Promise.all([
        Milestone.find({ projectRef: project._id }),
        Task.find({ projectRef: project._id }).populate('assigneeRef', 'name'),
        ImpactMetric.find({ projectRef: project._id }),
      ]);

      res.status(200).json({
        success: true,
        data: { project, milestones, tasks, impactMetrics },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const {
        challengeId,
        title,
        problemStatement,
        objective,
        expectedOutcome,
        technologyUsed = [],
        universityId,
        totalBudgetINR = 0,
        studentMembers = [],
      } = req.body;

      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Linked challenge not found.' });
        return;
      }

      const count = await Project.countDocuments();
      const projectCode = `PRJ-JH-${String(count + 101).padStart(4, '0')}`;

      const project = await Project.create({
        projectCode,
        challengeRef: challenge._id,
        title,
        problemStatement: problemStatement || challenge.description,
        objective,
        expectedOutcome,
        technologyUsed,
        stage: 'Proposal',
        leadFacultyRef: req.user?.id,
        universityRef: universityId,
        studentMembers,
        totalBudgetINR,
        fundingRaisedINR: 0,
      });

      // Update challenge status
      challenge.status = 'Solution Development';
      await challenge.save();

      // Create default kickoff milestone
      await Milestone.create({
        projectRef: project._id,
        title: 'Phase 1: Research & Prototyping Kickoff',
        description: 'Establish design requirements, sensor/hardware specifications, and field methodology.',
        targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        status: 'In Progress',
        progressPercent: 20,
      });

      res.status(201).json({
        success: true,
        message: 'Innovation project proposed successfully.',
        data: project,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateStage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { stage } = req.body;

      const project = await Project.findById(id);
      if (!project) {
        res.status(404).json({ success: false, message: 'Project not found.' });
        return;
      }

      project.stage = stage;
      if (stage === 'Completed') {
        project.progressPercent = 100;
        project.impactPassportGenerated = true;
      }
      await project.save();

      res.status(200).json({ success: true, message: `Stage updated to ${stage}`, data: project });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async createTask(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, priority, status, dueDate, assigneeRef } = req.body;

      const task = await Task.create({
        projectRef: id,
        title,
        description,
        priority: priority || 'Medium',
        status: status || 'Backlog',
        dueDate,
        assigneeRef,
      });

      res.status(201).json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateTaskStatus(req: Request, res: Response): Promise<void> {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      const task = await Task.findByIdAndUpdate(taskId, { status }, { new: true });
      res.status(200).json({ success: true, data: task });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
