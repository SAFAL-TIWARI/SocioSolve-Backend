import { Request, Response } from 'express';
import { GeminiService } from '../services/geminiService.js';
import { Challenge } from '../models/Challenge.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const AIController = {
  async analyzeDraft(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, district } = req.body;
      let imageResult: any = null;

      if (req.file) {
        imageResult = await GeminiService.analyzeImage(req.file.path, req.file.mimetype);
      }

      const classification = await GeminiService.classifyProblem(
        title || imageResult?.possibleIssue || 'Reported Issue',
        description || imageResult?.description || 'Citizen submitted defect.',
        district
      );

      res.status(200).json({
        success: true,
        data: {
          detectedIssue: imageResult?.possibleIssue || title || classification.subcategory,
          category: imageResult?.category || classification.category,
          severity: imageResult?.severity || classification.severity,
          confidence: imageResult?.confidence || classification.confidence,
          summary: classification.summary || imageResult?.description,
          affectedDomain: classification.affectedDomain,
          suggestedDepartment: imageResult?.suggestedDepartment || classification.suggestedDepartment,
          suggestedExpertise: imageResult?.suggestedExpertise || classification.suggestedExpertise,
          possibleImpact: imageResult?.possibleImpact || ['Community Welfare', 'Infrastructure Access'],
          requiresFieldVerification: true,
          keywords: classification.keywords,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async checkDuplicates(req: Request, res: Response): Promise<void> {
    try {
      const { title, description, district, category } = req.body;

      const candidates = await Challenge.find({
        $or: [
          { 'location.district': district },
          { category: category },
        ],
        status: { $nin: ['Resolved', 'Rejected'] },
      }).limit(5);

      const formattedCandidates = candidates.map(c => ({
        id: c.challengeId,
        title: c.title,
        description: c.description,
      }));

      const duplicates = await GeminiService.evaluateDuplicates(title, description, formattedCandidates);

      res.status(200).json({
        success: true,
        data: duplicates,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async copilot(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { query } = req.body;
      const userRole = req.user?.role || 'citizen';

      const totalChallenges = await Challenge.countDocuments();
      const inProgress = await Challenge.countDocuments({ status: { $in: ['Assigned', 'Solution Development', 'Pilot'] } });

      const contextSummary = `Total active challenges across Jharkhand: ${totalChallenges}, In-progress solutions: ${inProgress}.`;
      const reply = await GeminiService.copilotAssistant(userRole, query, contextSummary);

      res.status(200).json({
        success: true,
        data: { reply },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
