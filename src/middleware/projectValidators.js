import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

const projectStatusValues = ['PLANNING', 'IN_PROGRESS', 'ON_HOLD', 'COMPLETED'];

export const validateProjectId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors,
];

export const validateCreateProject = [
  body('name')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('description')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Description is required')
    .bail()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  body('status')
    .optional()
    .isIn(projectStatusValues)
    .withMessage(`Status must be one of: ${projectStatusValues.join(', ')}`),
  body('due_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  handleValidationErrors,
];

export const validateUpdateProject = [
  body()
    .custom((value) => Object.keys(value).length > 0)
    .withMessage('At least one field must be provided'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Name must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 5, max: 500 })
    .withMessage('Description must be between 5 and 500 characters'),
  body('status')
    .optional()
    .isIn(projectStatusValues)
    .withMessage(`Status must be one of: ${projectStatusValues.join(', ')}`),
  body('due_date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .withMessage('Due date must be a valid ISO 8601 date'),
  handleValidationErrors,
];
