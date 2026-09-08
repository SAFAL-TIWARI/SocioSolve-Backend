import { Request, Response } from 'express';
import { Challenge } from '../models/Challenge.js';
import { ChallengeEvidence } from '../models/ChallengeEvidence.js';
import { AIAnalysis } from '../models/AIAnalysis.js';
import { ChallengeValidation } from '../models/ChallengeValidation.js';
import { Resolution } from '../models/Resolution.js';
import { ResolutionVerification } from '../models/ResolutionVerification.js';
import { GovernmentAssignment } from '../models/GovernmentAssignment.js';
import { Escalation } from '../models/Escalation.js';
import { AuditLog } from '../models/AuditLog.js';
import { Department } from '../models/Department.js';
import { GeminiService } from '../services/geminiService.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const ChallengeController = {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const {
        district,
        category,
        severity,
        status,
        search,
        page = '1',
        limit = '12',
        sortBy = 'createdAt',
        sortOrder = 'desc',
      } = req.query;

      const query: any = {};
      if (district) query['location.district'] = district;
      if (category) query.category = category;
      if (severity) query.severity = severity;
      if (status) query.status = status;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { challengeId: { $regex: search, $options: 'i' } },
        ];
      }

      const pageNum = parseInt(page as string, 10) || 1;
      const limitNum = parseInt(limit as string, 10) || 12;
      const skip = (pageNum - 1) * limitNum;

      const [challenges, total] = await Promise.all([
        Challenge.find(query)
          .sort({ [sortBy as string]: sortOrder === 'asc' ? 1 : -1 })
          .skip(skip)
          .limit(limitNum)
          .populate('assignedDeptRef', 'name code domain')
          .populate('leadUniversityRef', 'name code')
          .populate('leadIndustryRef', 'organizationName'),
        Challenge.countDocuments(query),
      ]);

      res.status(200).json({
        success: true,
        data: challenges,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id as string;
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const challenge = await Challenge.findOne({
        $or: [{ _id: isObjectId ? id : null }, { challengeId: id }],
      })
        .populate('citizenRef', 'name email district')
        .populate('assignedDeptRef', 'name code domain nodalOfficerRef')
        .populate('assignedOfficerRef', 'name designation email')
        .populate('leadUniversityRef', 'name code')
        .populate('leadIndustryRef', 'organizationName');

      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found.' });
        return;
      }

      const [evidence, aiAnalysis, validations, assignments, escalations, resolution, verification] = await Promise.all([
        ChallengeEvidence.find({ challengeRef: challenge._id }),
        AIAnalysis.findOne({ challengeRef: challenge._id }),
        ChallengeValidation.find({ challengeRef: challenge._id }).populate('userRef', 'name district'),
        GovernmentAssignment.find({ challengeRef: challenge._id }).populate('departmentRef', 'name').populate('assignedOfficerRef', 'name designation'),
        Escalation.find({ challengeRef: challenge._id }).sort({ createdAt: -1 }),
        Resolution.findOne({ challengeRef: challenge._id }),
        ResolutionVerification.find({ challengeRef: challenge._id }).populate('citizenRef', 'name'),
      ]);

      res.status(200).json({
        success: true,
        data: {
          challenge,
          evidence,
          aiAnalysis,
          validations,
          assignments,
          escalations,
          resolution,
          verification,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const {
        title,
        description,
        category,
        subcategory,
        severity,
        urgency,
        location,
        affectedCount,
        safetyRisk,
        durationMonths,
        whoIsAffected,
        evidenceUrls = [],
        aiAnalysisData,
      } = req.body;

      if (!title || !description || !category || !location || !location.district) {
        res.status(400).json({ success: false, message: 'Title, description, category, and location with district are required.' });
        return;
      }

      // Generate unique Challenge ID: JH-2026-XXXXXX
      const count = await Challenge.countDocuments();
      const paddedNumber = String(count + 101).padStart(6, '0');
      const challengeId = `JH-2026-${paddedNumber}`;

      // Set SLA due date (default 7 days for medium, 3 days for high, 24h for critical)
      let slaHours = 7 * 24;
      if (severity === 'Critical') slaHours = 24;
      else if (severity === 'High') slaHours = 3 * 24;
      const slaDueAt = new Date(Date.now() + slaHours * 60 * 60 * 1000);

      // Attempt matching department
      const dept = await Department.findOne({
        $or: [
          { name: { $regex: category, $options: 'i' } },
          { domain: { $regex: category, $options: 'i' } },
        ],
      });

      const challenge = await Challenge.create({
        challengeId,
        title,
        description,
        category,
        subcategory,
        severity: severity || 'Medium',
        urgency: urgency || 'Medium',
        status: 'Submitted',
        location: {
          type: 'Point',
          coordinates: [location.longitude || 85.3096, location.latitude || 23.3441],
          district: location.district,
          block: location.block,
          villageOrWard: location.villageOrWard,
          landmark: location.landmark,
          address: location.address,
        },
        affectedCount: affectedCount || 1,
        safetyRisk: safetyRisk || false,
        durationMonths: durationMonths || 1,
        whoIsAffected,
        evidenceUrls,
        citizenRef: req.user.id,
        assignedDeptRef: dept?._id,
        slaDueAt,
        escalationLevel: 0,
        citizenValidationCount: 1,
        confirmationCount: 1,
        aiConfidence: aiAnalysisData?.confidence || 0.88,
        aiSuggestedDept: aiAnalysisData?.suggestedDepartment || dept?.name,
        aiSuggestedKeywords: aiAnalysisData?.keywords || [],
      });

      // Save AI analysis audit record if provided
      if (aiAnalysisData) {
        await AIAnalysis.create({
          challengeRef: challenge._id,
          detectedIssue: aiAnalysisData.detectedIssue || title,
          category: aiAnalysisData.category || category,
          severity: aiAnalysisData.severity || severity || 'Medium',
          confidence: aiAnalysisData.confidence || 0.88,
          summary: aiAnalysisData.summary || description.slice(0, 150),
          affectedDomain: aiAnalysisData.affectedDomain || category,
          suggestedDepartment: aiAnalysisData.suggestedDepartment || 'Municipal Administration',
          suggestedExpertise: aiAnalysisData.suggestedExpertise || ['Civil Works'],
          possibleImpact: aiAnalysisData.possibleImpact || ['Public Health & Safety'],
          userCorrections: aiAnalysisData.userCorrections,
        });
      }

      // Initial validation by creator
      await ChallengeValidation.create({
        challengeRef: challenge._id,
        userRef: req.user.id,
        type: 'confirm',
        comments: 'Original reporting citizen.',
        evidenceUrls,
      });

      // Audit Log
      await AuditLog.create({
        actorRef: req.user.id,
        actorRole: req.user.role,
        action: 'CHALLENGE_CREATED',
        entityType: 'Challenge',
        entityId: challenge.challengeId,
        newState: { title, category, severity, district: location.district },
      });

      res.status(201).json({
        success: true,
        message: 'Challenge reported successfully with official tracking ID.',
        data: challenge,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async validateChallenge(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const { type, comments, evidenceUrls = [] } = req.body;

      const challenge = await Challenge.findById(id);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found.' });
        return;
      }

      const existing = await ChallengeValidation.findOne({
        challengeRef: challenge._id,
        userRef: req.user.id,
        type,
      });

      if (existing) {
        res.status(409).json({ success: false, message: `You have already submitted a '${type}' endorsement for this challenge.` });
        return;
      }

      await ChallengeValidation.create({
        challengeRef: challenge._id,
        userRef: req.user.id,
        type: type || 'affected',
        comments,
        evidenceUrls,
      });

      if (type === 'affected') {
        challenge.affectedCount += 1;
        challenge.citizenValidationCount += 1;
      } else {
        challenge.confirmationCount += 1;
      }
      await challenge.save();

      res.status(200).json({
        success: true,
        message: 'Your endorsement and validation have been recorded.',
        data: {
          affectedCount: challenge.affectedCount,
          confirmationCount: challenge.confirmationCount,
        },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async assignDepartment(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const { departmentId, officerId, priority, instructions } = req.body;

      const challenge = await Challenge.findById(id);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found.' });
        return;
      }

      challenge.assignedDeptRef = departmentId;
      if (officerId) challenge.assignedOfficerRef = officerId;
      challenge.status = 'Assigned';
      await challenge.save();

      await GovernmentAssignment.create({
        challengeRef: challenge._id,
        departmentRef: departmentId,
        assignedOfficerRef: officerId,
        assignedByRef: req.user.id,
        priority: priority || 'Routine',
        instructions,
        status: 'Assigned',
      });

      await AuditLog.create({
        actorRef: req.user.id,
        actorRole: req.user.role,
        action: 'CHALLENGE_ASSIGNED',
        entityType: 'Challenge',
        entityId: challenge.challengeId,
        newState: { departmentId, officerId, status: 'Assigned' },
      });

      res.status(200).json({
        success: true,
        message: 'Challenge assigned to department successfully.',
        data: challenge,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async escalateChallenge(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const { reason, actionRequired, responsibleAuthority } = req.body;

      const challenge = await Challenge.findById(id);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found.' });
        return;
      }

      challenge.escalationLevel = Math.min((challenge.escalationLevel || 0) + 1, 4);
      challenge.status = 'Escalated';
      await challenge.save();

      const levelTitles = ['', 'Assigned Officer Warning', 'Department Supervisor Review', 'District Magistrate Authority', 'State Nodal Oversight'];

      const escalation = await Escalation.create({
        challengeRef: challenge._id,
        level: challenge.escalationLevel,
        levelTitle: levelTitles[challenge.escalationLevel] || 'Escalated Authority',
        reason: reason || 'SLA breached or unresolved citizen escalation.',
        triggeredBy: req.user.role === 'government' ? 'manual_officer' : 'automatic_sla_breach',
        responsibleAuthority: responsibleAuthority || 'District Administration',
        actionRequired: actionRequired || 'Immediate site inspection and departmental status review required.',
      });

      await AuditLog.create({
        actorRef: req.user.id,
        actorRole: req.user.role,
        action: 'CHALLENGE_ESCALATED',
        entityType: 'Challenge',
        entityId: challenge.challengeId,
        newState: { escalationLevel: challenge.escalationLevel, reason },
      });

      res.status(200).json({
        success: true,
        message: `Challenge escalated to Level ${challenge.escalationLevel}.`,
        data: escalation,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async submitResolution(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const { beforePhotos = [], afterPhotos = [], explanation, fieldInspectionReport } = req.body;

      if (!explanation || afterPhotos.length === 0) {
        res.status(400).json({ success: false, message: 'Resolution explanation and after-photos are mandatory proof of completion.' });
        return;
      }

      const challenge = await Challenge.findById(id);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found.' });
        return;
      }

      // Assess resolution with Gemini AI
      const aiResolution = await GeminiService.assessResolution(challenge.description, explanation);

      const resolution = await Resolution.create({
        challengeRef: challenge._id,
        submittedByRef: req.user.id,
        beforePhotos: beforePhotos.length > 0 ? beforePhotos : challenge.evidenceUrls,
        afterPhotos,
        explanation,
        fieldInspectionReport,
        aiResolutionAssessment: aiResolution,
      });

      challenge.status = 'Resolution Submitted';
      await challenge.save();

      await AuditLog.create({
        actorRef: req.user.id,
        actorRole: req.user.role,
        action: 'RESOLUTION_SUBMITTED',
        entityType: 'Challenge',
        entityId: challenge.challengeId,
        newState: { explanation, afterPhotosCount: afterPhotos.length },
      });

      res.status(200).json({
        success: true,
        message: 'Resolution evidence submitted. Ready for citizen verification.',
        data: resolution,
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async verifyResolution(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Authentication required.' });
        return;
      }

      const { id } = req.params;
      const { verifiedStatus, disputeReason, citizenEvidenceUrls = [] } = req.body;

      const challenge = await Challenge.findById(id);
      if (!challenge) {
        res.status(404).json({ success: false, message: 'Challenge not found.' });
        return;
      }

      await ResolutionVerification.create({
        challengeRef: challenge._id,
        citizenRef: req.user.id,
        verifiedStatus,
        disputeReason,
        citizenEvidenceUrls,
      });

      if (verifiedStatus === 'Yes') {
        challenge.status = 'Resolved';
      } else if (verifiedStatus === 'No') {
        challenge.status = 'Escalated';
        challenge.escalationLevel = Math.min((challenge.escalationLevel || 0) + 1, 4);
      } else {
        challenge.status = 'Needs More Information';
      }
      await challenge.save();

      await AuditLog.create({
        actorRef: req.user.id,
        actorRole: req.user.role,
        action: 'RESOLUTION_VERIFIED_BY_CITIZEN',
        entityType: 'Challenge',
        entityId: challenge.challengeId,
        newState: { verifiedStatus, disputeReason },
      });

      res.status(200).json({
        success: true,
        message: verifiedStatus === 'Yes' ? 'Challenge verified as Resolved by citizen.' : 'Dispute recorded. Case flagged for supervisor review.',
        data: { status: challenge.status, verifiedStatus },
      });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};
