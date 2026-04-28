import { getLabel } from '../services/labelService.js';
import { getProject } from '../services/projectService.js';
import { getTask } from '../services/taskService.js';

export async function authorizeProjectOwner(req, res, next) {
  const project = await getProject(Number(req.params.id));
  if (req.user.role !== 'ADMIN' && project.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'Forbidden: insufficient permission' });
  }
  req.project = project;
  return next();
}

export async function authorizeLabelOwner(req, res, next) {
  const label = await getLabel(Number(req.params.id));
  if (req.user.role !== 'ADMIN' && label.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'Forbidden: insufficient permission' });
  }
  req.label = label;
  return next();
}

export async function authorizeTaskOwner(req, res, next) {
  const task = await getTask(Number(req.params.id));
  const project = await getProject(task.project_id);
  if (req.user.role !== 'ADMIN' && project.user_id !== req.user.id) {
    return res
      .status(403)
      .json({ error: 'Forbidden: insufficient permission' });
  }
  req.task = task;
  return next();
}
