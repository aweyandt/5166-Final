import {
  createProjectForUser,
  deleteProjectById,
  getProject,
  listProjects,
  updateProjectById,
} from '../services/projectService.js';
import { serializeProject } from '../utils/serializers.js';

export async function listProjectsHandler(req, res) {
  const projects = await listProjects(req.user);
  return res.status(200).json(projects.map(serializeProject));
}

export async function getProjectHandler(req, res) {
  const project = await getProject(Number(req.params.id));
  return res.status(200).json(serializeProject(project));
}

export async function createProjectHandler(req, res) {
  const project = await createProjectForUser(req.user, {
    name: req.body.name,
    description: req.body.description,
    status: req.body.status,
    due_date: req.body.due_date ? new Date(req.body.due_date) : null,
  });
  return res.status(201).json(serializeProject(project));
}

export async function updateProjectHandler(req, res) {
  const project = await updateProjectById(Number(req.params.id), {
    ...(req.body.name ? { name: req.body.name } : {}),
    ...(req.body.description ? { description: req.body.description } : {}),
    ...(req.body.status ? { status: req.body.status } : {}),
    ...(Object.hasOwn(req.body, 'due_date')
      ? { due_date: req.body.due_date ? new Date(req.body.due_date) : null }
      : {}),
  });
  return res.status(200).json(serializeProject(project));
}

export async function deleteProjectHandler(req, res) {
  const project = await deleteProjectById(Number(req.params.id));
  return res.status(200).json({
    id: project.id,
    message: 'Project deleted successfully',
  });
}
