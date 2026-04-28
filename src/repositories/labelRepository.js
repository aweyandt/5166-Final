import prisma from '../config/db.js';

export function createLabel(data) {
  return prisma.label.create({ data });
}

export function getLabelsForUser(user) {
  return prisma.label.findMany({
    where: user.role === 'ADMIN' ? {} : { user_id: user.id },
    orderBy: { id: 'asc' },
  });
}

export function getLabelById(id) {
  return prisma.label.findUnique({ where: { id } });
}

export function updateLabel(id, data) {
  return prisma.label.update({
    where: { id },
    data,
  });
}

export function deleteLabel(id) {
  return prisma.label.delete({ where: { id } });
}
