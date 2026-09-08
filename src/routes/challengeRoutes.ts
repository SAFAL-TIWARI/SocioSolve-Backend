import { Router } from 'express';
import { ChallengeController } from '../controllers/challengeController.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const router = Router();
router.get('/', ChallengeController.getAll);
router.get('/:id', ChallengeController.getById);
router.post('/', authenticate, ChallengeController.create);
router.post('/:id/validate', authenticate, ChallengeController.validateChallenge);
router.post('/:id/assign', authenticate, requireRole(['government', 'admin']), ChallengeController.assignDepartment);
router.post('/:id/escalate', authenticate, ChallengeController.escalateChallenge);
router.post('/:id/resolve', authenticate, requireRole(['government', 'university', 'industry', 'admin']), ChallengeController.submitResolution);
router.post('/:id/verify-resolution', authenticate, ChallengeController.verifyResolution);

export default router;
