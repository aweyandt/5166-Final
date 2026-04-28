import express from 'express';
import {
  createTaskHandler,
  deleteTaskHandler,
  getTaskHandler,
  listTasksHandler,
  updateTaskHandler,
} from '../controllers/taskController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeTaskOwner } from '../middleware/ownership.js';
import {
  validateCreateTask,
  validateTaskId,
  validateTaskQuery,
  validateUpdateTask,
} from '../middleware/taskValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get('/', validateTaskQuery, asyncHandler(listTasksHandler));
router.get('/:id', validateTaskId, asyncHandler(authorizeTaskOwner), asyncHandler(getTaskHandler));
router.post('/', validateCreateTask, asyncHandler(createTaskHandler));
router.put(
  '/:id',
  validateTaskId,
  asyncHandler(authorizeTaskOwner),
  validateUpdateTask,
  asyncHandler(updateTaskHandler),
);
router.delete(
  '/:id',
  validateTaskId,
  asyncHandler(authorizeTaskOwner),
  asyncHandler(deleteTaskHandler),
);

export default router;
