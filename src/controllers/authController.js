import {
  getRegisteredUserTotal,
  logIn,
  signUp,
} from '../services/authService.js';
import { serializeUser } from '../utils/serializers.js';

export async function signupHandler(req, res) {
  const user = await signUp(req.body);
  return res.status(201).json(serializeUser(user));
}

export async function loginHandler(req, res) {
  const token = await logIn(req.body);
  return res.status(200).json({ token });
}

export async function userCountHandler(req, res) {
  const totals = await getRegisteredUserTotal();
  return res.status(200).json({
    total_users: totals.total_users,
    users: totals.users.map(serializeUser),
  });
}

//comment