import { Router } from 'express';
import { ProjectController } from '../controllers/projectController.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();
router.get('/', ProjectController.getAll);
router.get('/:id', ProjectController.getById);
router.post('/', authenticate, ProjectController.create);
router.patch('/:id/stage', authenticate, ProjectController.updateStage);
router.post('/:id/tasks', authenticate, ProjectController.createTask);
router.patch('/tasks/:taskId', authenticate, ProjectController.updateTaskStatus);

export default router;
