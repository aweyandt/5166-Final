import {
  createTaskForUser,
  deleteTaskById,
  getTask,
  listTasks,
  updateTaskById,
} from '../services/taskService.js';
import { serializeTask } from '../utils/serializers.js';

export async function listTasksHandler(req, res) {
  const tasks = (await listTasks(req.user, {
    project_id: req.query.project_id ? Number(req.query.project_id) : undefined,
    status: req.query.status,
    priority: req.query.priority,
  })).map(serializeTask);
  return res.status(200).json({
    message: tasks.length > 0
      ? 'Request successful.'
      : 'Request successful. Nothing has been started yet.',
    data: tasks,
  });
}

export async function getTaskHandler(req, res) {
  const task = await getTask(Number(req.params.id));
  return res.status(200).json(serializeTask(task));
}

export async function createTaskHandler(req, res) {
  const task = await createTaskForUser(req.user, {
    project_id: Number(req.body.project_id),
    assigned_user_id: req.body.assigned_user_id
      ? Number(req.body.assigned_user_id)
      : null,
    title: req.body.title,
    description: req.body.description,
    priority: req.body.priority,
    status: req.body.status,
    due_date: req.body.due_date ? new Date(req.body.due_date) : null,
    label_ids: req.body.label_ids,
  });
  return res.status(201).json(serializeTask(task));
}

export async function updateTaskHandler(req, res) {
  const task = await updateTaskById(Number(req.params.id), req.user, {
    ...(req.body.project_id ? { project_id: Number(req.body.project_id) } : {}),
    ...(Object.hasOwn(req.body, 'assigned_user_id')
      ? {
          assigned_user_id:
            req.body.assigned_user_id === null
              ? null
              : Number(req.body.assigned_user_id),
        }
      : {}),
    ...(req.body.title ? { title: req.body.title } : {}),
    ...(req.body.description ? { description: req.body.description } : {}),
    ...(req.body.priority ? { priority: req.body.priority } : {}),
    ...(req.body.status ? { status: req.body.status } : {}),
    ...(Object.hasOwn(req.body, 'due_date')
      ? { due_date: req.body.due_date ? new Date(req.body.due_date) : null }
      : {}),
    ...(Object.hasOwn(req.body, 'label_ids')
      ? { label_ids: req.body.label_ids }
      : {}),
  });
  return res.status(200).json(serializeTask(task));
}

export async function deleteTaskHandler(req, res) {
  const task = await deleteTaskById(Number(req.params.id));
  return res.status(200).json({
    id: task.id,
    message: 'Task deleted successfully',
  });
}
