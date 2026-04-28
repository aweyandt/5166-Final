import express from 'express';
import { loginHandler, signupHandler } from '../controllers/authController.js';
import { validateLogin, validateSignup } from '../middleware/authValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/signup', validateSignup, asyncHandler(signupHandler));
router.post('/login', validateLogin, asyncHandler(loginHandler));

export default router;
