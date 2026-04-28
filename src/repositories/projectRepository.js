import prisma from '../config/db.js';

export function createProject(data) {
  return prisma.project.create({ data });
}

export function getProjectsForUser(user) {
  return prisma.project.findMany({
    where: user.role === 'ADMIN' ? {} : { user_id: user.id },
    orderBy: { id: 'asc' },
  });
}

export function getProjectById(id) {
  return prisma.project.findUnique({ where: { id } });
}

export function updateProject(id, data) {
  return prisma.project.update({
    where: { id },
    data,
  });
}

export function deleteProject(id) {
  return prisma.project.delete({ where: { id } });
}
