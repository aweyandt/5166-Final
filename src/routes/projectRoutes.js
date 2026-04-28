import express from 'express';
import {
  createProjectHandler,
  deleteProjectHandler,
  getProjectHandler,
  listProjectsHandler,
  updateProjectHandler,
} from '../controllers/projectController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeProjectOwner } from '../middleware/ownership.js';
import {
  validateCreateProject,
  validateProjectId,
  validateUpdateProject,
} from '../middleware/projectValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get('/', asyncHandler(listProjectsHandler));
router.get('/:id', validateProjectId, asyncHandler(authorizeProjectOwner), asyncHandler(getProjectHandler));
router.post('/', validateCreateProject, asyncHandler(createProjectHandler));
router.put(
  '/:id',
  validateProjectId,
  asyncHandler(authorizeProjectOwner),
  validateUpdateProject,
  asyncHandler(updateProjectHandler),
);
router.delete(
  '/:id',
  validateProjectId,
  asyncHandler(authorizeProjectOwner),
  asyncHandler(deleteProjectHandler),
);

export default router;
