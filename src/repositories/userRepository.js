import prisma from '../config/db.js';

export function createUser(data) {
  return prisma.user.create({ data });
}

export function findUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserByUsername(username) {
  return prisma.user.findUnique({ where: { username } });
}

export function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}

export function countUsers() {
  return prisma.user.count();
}

export function listUsers() {
  return prisma.user.findMany({
    orderBy: { created_at: 'asc' },
  });
}
