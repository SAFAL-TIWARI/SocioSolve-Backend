import { Router } from 'express';
import { DepartmentController } from '../controllers/departmentController.js';

const router = Router();
router.get('/', DepartmentController.getAll);
router.get('/:id/stats', DepartmentController.getStats);

export default router;
