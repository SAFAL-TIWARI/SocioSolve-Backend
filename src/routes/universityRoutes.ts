import { Router } from 'express';
import { UniversityController } from '../controllers/universityController.js';

const router = Router();
router.get('/', UniversityController.getAll);
router.get('/:id', UniversityController.getById);
router.get('/:id/matched-challenges', UniversityController.getMatchedChallenges);

export default router;
