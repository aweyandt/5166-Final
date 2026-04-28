import { body, param, query } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

const taskStatusValues = ['TODO', 'IN_PROGRESS', 'DONE', 'BLOCKED'];
const taskPriorityValues = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const validateTaskId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors,
];

export const validateTaskQuery = [
  query('project_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Project ID must be a positive integer'),
  query('status')
    .optional()
    .isIn(taskStatusValues)
    .withMessage(`Status must be one of: ${taskStatusValues.join(', ')}`),
  query('priority')
    .optional()
    .isIn(taskPriorityValues)
    .withMessage(`Priority must be one of: ${taskPriorityValues.join(', ')}`),
  handleValidationErrors,
];

export const validateCreateTask = [
  body('project_id')
    .isInt({ gt: 0 })
    .withMessage('Project ID must be a positive integer'),
  body('assigned_user_id')
    .optional({ values: 'falsy' })
    .isInt({ gt: 0 })
    .withMessage('Assigned user ID must be a positive integer'),
  body('title')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Title is required')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Description is required')
    .bail()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Description must be between 5 and 1000 characters'),
  body('priority')
    .optional()
    .isIn(taskPriorityValues)
    .withMessage(`Priority must be one of: ${taskPriorityValues.join(', ')}`),
  body('status')
    .optional()
    .isIn(taskStatusValues)
    .withMessage(`Status must be one of: ${taskStatusValues.join(', ')}`),
  body('due_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  body('label_ids')
    .optional()
    .isArray()
    .withMessage('Label IDs must be an array'),
  body('label_ids.*')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Each label ID must be a positive integer'),
  handleValidationErrors,
];

export const validateUpdateTask = [
  body()
    .custom((value) => Object.keys(value).length > 0)
    .withMessage('At least one field must be provided'),
  body('project_id')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Project ID must be a positive integer'),
  body('assigned_user_id')
    .optional({ nullable: true })
    .custom((value) => value === null || Number.isInteger(value) || /^\d+$/.test(String(value)))
    .withMessage('Assigned user ID must be a positive integer or null'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 1000 })
    .withMessage('Description must be between 5 and 1000 characters'),
  body('priority')
    .optional()
    .isIn(taskPriorityValues)
    .withMessage(`Priority must be one of: ${taskPriorityValues.join(', ')}`),
  body('status')
    .optional()
    .isIn(taskStatusValues)
    .withMessage(`Status must be one of: ${taskStatusValues.join(', ')}`),
  body('due_date')
    .optional({ nullable: true })
    .custom((value) => value === null || !Number.isNaN(Date.parse(value)))
    .withMessage('Due date must be a valid ISO 8601 date or null'),
  body('label_ids')
    .optional()
    .isArray()
    .withMessage('Label IDs must be an array'),
  body('label_ids.*')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('Each label ID must be a positive integer'),
  handleValidationErrors,
];
