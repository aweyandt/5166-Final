import express from 'express';
import {
  createLabelHandler,
  deleteLabelHandler,
  getLabelHandler,
  listLabelsHandler,
  updateLabelHandler,
} from '../controllers/labelController.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeLabelOwner } from '../middleware/ownership.js';
import {
  validateCreateLabel,
  validateLabelId,
  validateUpdateLabel,
} from '../middleware/labelValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.use(authenticate);

router.get('/', asyncHandler(listLabelsHandler));
router.get('/:id', validateLabelId, asyncHandler(authorizeLabelOwner), asyncHandler(getLabelHandler));
router.post('/', validateCreateLabel, asyncHandler(createLabelHandler));
router.put(
  '/:id',
  validateLabelId,
  asyncHandler(authorizeLabelOwner),
  validateUpdateLabel,
  asyncHandler(updateLabelHandler),
);
router.delete(
  '/:id',
  validateLabelId,
  asyncHandler(authorizeLabelOwner),
  asyncHandler(deleteLabelHandler),
);

export default router;
