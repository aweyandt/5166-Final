import prisma from '../config/db.js';

const taskInclude = {
  task_labels: {
    include: {
      label: true,
    },
  },
};

export function createTask(data, labelIds = []) {
  return prisma.task.create({
    data: {
      ...data,
      task_labels: {
        create: labelIds.map((labelId) => ({ label_id: labelId })),
      },
    },
    include: taskInclude,
  });
}

export function getTasksForUser(user, filters = {}) {
  const where = {
    ...(user.role === 'ADMIN' ? {} : { project: { user_id: user.id } }),
    ...(filters.project_id ? { project_id: filters.project_id } : {}),
    ...(filters.status ? { status: filters.status } : {}),
    ...(filters.priority ? { priority: filters.priority } : {}),
  };

  return prisma.task.findMany({
    where,
    include: taskInclude,
    orderBy: { id: 'asc' },
  });
}

export function getTaskById(id) {
  return prisma.task.findUnique({
    where: { id },
    include: taskInclude,
  });
}

export async function updateTask(id, data, labelIds) {
  return prisma.$transaction(async (tx) => {
    if (Array.isArray(labelIds)) {
      await tx.taskLabel.deleteMany({ where: { task_id: id } });
    }

    return tx.task.update({
      where: { id },
      data: {
        ...data,
        ...(Array.isArray(labelIds)
          ? {
              task_labels: {
                create: labelIds.map((labelId) => ({ label_id: labelId })),
              },
            }
          : {}),
      },
      include: taskInclude,
    });
  });
}

export function deleteTask(id) {
  return prisma.task.delete({ where: { id } });
}
