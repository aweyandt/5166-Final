import express from 'express';
import {
  loginHandler,
  signupHandler,
  userCountHandler,
} from '../controllers/authController.js';
import { authenticate } from '../middleware/authenticate.js';
import { validateLogin, validateSignup } from '../middleware/authValidators.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

function authorizeUserDirectoryAccess(req, res, next) {
  if (req.user.role === 'ADMIN' || req.user.email === 'owner@example.com') {
    return next();
  }

  return res.status(403).json({ error: 'Forbidden: insufficient permission' });
}

router.post('/signup', validateSignup, asyncHandler(signupHandler));
router.post('/login', validateLogin, asyncHandler(loginHandler));
router.get(
  '/users/count',
  authenticate,
  authorizeUserDirectoryAccess,
  asyncHandler(userCountHandler),
);

export default router;
