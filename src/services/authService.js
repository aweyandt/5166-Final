import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  countUsers,
  createUser,
  findUserByEmail,
  findUserByUsername,
  listUsers,
} from '../repositories/userRepository.js';
import { createError } from '../utils/errors.js';

export async function signUp({ username, email, password, role = 'USER' }) {
  const existingEmail = await findUserByEmail(email);
  if (existingEmail) {
    throw createError(409, 'Email has already been used');
  }

  const existingUsername = await findUserByUsername(username);
  if (existingUsername) {
    throw createError(409, 'Username has already been used');
  }

  const password_hash = await bcrypt.hash(password, 10);
  return createUser({ username, email, password_hash, role });
}

export async function logIn({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }

  const matches = await bcrypt.compare(password, user.password_hash);
  if (!matches) {
    throw createError(401, 'Invalid credentials');
  }

  return jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' },
  );
}

export async function getRegisteredUserTotal() {
  const total_users = await countUsers();
  const users = await listUsers();
  return { total_users, users };
}
