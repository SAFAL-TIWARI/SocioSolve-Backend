import { Router } from 'express';
import { AIController } from '../controllers/aiController.js';
import { upload } from '../middleware/upload.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.post('/analyze-draft', upload.single('evidence'), AIController.analyzeDraft);
router.post('/check-duplicates', AIController.checkDuplicates);
router.post('/copilot', authenticate, AIController.copilot);

export default router;
