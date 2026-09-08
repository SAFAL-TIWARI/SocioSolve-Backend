import { Router } from 'express';
import { AnalyticsController } from '../controllers/analyticsController.js';

const router = Router();
router.get('/public-impact', AnalyticsController.getPublicImpact);
router.get('/government-kpis', AnalyticsController.getGovernmentKPIs);

export default router;
