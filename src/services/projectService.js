import {
  createProject,
  deleteProject,
  getProjectById,
  getProjectsForUser,
  updateProject,
} from '../repositories/projectRepository.js';
import { createError } from '../utils/errors.js';

export async function listProjects(user) {
  return getProjectsForUser(user);
}

export async function getProject(id) {
  const project = await getProjectById(id);
  if (!project) {
    throw createError(404, `Project ${id} not found`);
  }
  return project;
}

export async function createProjectForUser(user, data) {
  return createProject({ ...data, user_id: user.id });
}

export async function updateProjectById(id, data) {
  try {
    return await updateProject(id, data);
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError(404, `Project ${id} not found`);
    }
    throw error;
  }
}

export async function deleteProjectById(id) {
  try {
    return await deleteProject(id);
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError(404, `Project ${id} not found`);
    }
    throw error;
  }
}
