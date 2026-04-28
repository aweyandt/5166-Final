import prisma from '../config/db.js';
import {
  createTask,
  deleteTask,
  getTaskById,
  getTasksForUser,
  updateTask,
} from '../repositories/taskRepository.js';
import { getProject } from './projectService.js';
import { createError } from '../utils/errors.js';

async function validateLabelsBelongToUser(user, labelIds = []) {
  if (labelIds.length === 0) {
    return;
  }

  const labels = await prisma.label.findMany({
    where: {
      id: { in: labelIds },
      ...(user.role === 'ADMIN' ? {} : { user_id: user.id }),
    },
  });

  if (labels.length !== labelIds.length) {
    throw createError(400, 'One or more labels are invalid or inaccessible');
  }
}

export async function listTasks(user, filters) {
  return getTasksForUser(user, filters);
}

export async function getTask(id) {
  const task = await getTaskById(id);
  if (!task) {
    throw createError(404, `Task ${id} not found`);
  }
  return task;
}

export async function createTaskForUser(user, data) {
  const project = await getProject(data.project_id);
  if (user.role !== 'ADMIN' && project.user_id !== user.id) {
    throw createError(403, 'Forbidden: insufficient permission');
  }

  if (data.assigned_user_id) {
    const assignedUser = await prisma.user.findUnique({
      where: { id: data.assigned_user_id },
    });
    if (!assignedUser) {
      throw createError(400, 'Assigned user does not exist');
    }
  }

  await validateLabelsBelongToUser(user, data.label_ids ?? []);

  return createTask(
    {
      project_id: data.project_id,
      assigned_user_id: data.assigned_user_id ?? null,
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: data.status,
      due_date: data.due_date ?? null,
    },
    data.label_ids ?? [],
  );
}

export async function updateTaskById(id, user, data) {
  const existingTask = await getTask(id);
  const project = await getProject(existingTask.project_id);
  if (user.role !== 'ADMIN' && project.user_id !== user.id) {
    throw createError(403, 'Forbidden: insufficient permission');
  }

  if (data.assigned_user_id) {
    const assignedUser = await prisma.user.findUnique({
      where: { id: data.assigned_user_id },
    });
    if (!assignedUser) {
      throw createError(400, 'Assigned user does not exist');
    }
  }

  if (Array.isArray(data.label_ids)) {
    await validateLabelsBelongToUser(user, data.label_ids);
  }

  try {
    return await updateTask(
      id,
      {
        ...(data.project_id ? { project_id: data.project_id } : {}),
        ...(Object.hasOwn(data, 'assigned_user_id')
          ? { assigned_user_id: data.assigned_user_id }
          : {}),
        ...(data.title ? { title: data.title } : {}),
        ...(data.description ? { description: data.description } : {}),
        ...(data.priority ? { priority: data.priority } : {}),
        ...(data.status ? { status: data.status } : {}),
        ...(Object.hasOwn(data, 'due_date') ? { due_date: data.due_date } : {}),
      },
      data.label_ids,
    );
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError(404, `Task ${id} not found`);
    }
    throw error;
  }
}

export async function deleteTaskById(id) {
  try {
    return await deleteTask(id);
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError(404, `Task ${id} not found`);
    }
    throw error;
  }
}
