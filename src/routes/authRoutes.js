import express from 'express';
import {
  loginHandler,
  signupHandler,
  userCountHandler,
} from '../controllers/authController.js';
import { validateLogin, validateSignup } from '../middleware/authValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

router.post('/signup', validateSignup, asyncHandler(signupHandler));
router.post('/login', validateLogin, asyncHandler(loginHandler));
router.get('/users/count', asyncHandler(userCountHandler));

export default router;
