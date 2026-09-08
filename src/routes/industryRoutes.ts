import { Router } from 'express';
import { IndustryController } from '../controllers/industryController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/', IndustryController.getAll);
router.get('/csr-opportunities', IndustryController.getCSROpportunities);
router.post('/pledge-funding', authenticate, IndustryController.pledgeFunding);

export default router;
