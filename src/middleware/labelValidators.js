import { body, param } from 'express-validator';
import { handleValidationErrors } from './handleValidationErrors.js';

export const validateLabelId = [
  param('id')
    .isInt({ gt: 0 })
    .withMessage('ID must be a positive integer'),
  handleValidationErrors,
];

export const validateCreateLabel = [
  body('name')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Name is required')
    .bail()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('color')
    .trim()
    .exists({ values: 'falsy' })
    .withMessage('Color is required')
    .bail()
    .matches(/^#([0-9a-fA-F]{6})$/)
    .withMessage('Color must be a valid hex color'),
  handleValidationErrors,
];

export const validateUpdateLabel = [
  body()
    .custom((value) => Object.keys(value).length > 0)
    .withMessage('At least one field must be provided'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('color')
    .optional()
    .trim()
    .matches(/^#([0-9a-fA-F]{6})$/)
    .withMessage('Color must be a valid hex color'),
  handleValidationErrors,
];
