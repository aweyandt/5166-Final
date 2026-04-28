import {
  createLabel,
  deleteLabel,
  getLabelById,
  getLabelsForUser,
  updateLabel,
} from '../repositories/labelRepository.js';
import { createError } from '../utils/errors.js';

export async function listLabels(user) {
  return getLabelsForUser(user);
}

export async function getLabel(id) {
  const label = await getLabelById(id);
  if (!label) {
    throw createError(404, `Label ${id} not found`);
  }
  return label;
}

export async function createLabelForUser(user, data) {
  try {
    return await createLabel({ ...data, user_id: user.id });
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError(409, 'A label with that name already exists for this user');
    }
    throw error;
  }
}

export async function updateLabelById(id, data) {
  try {
    return await updateLabel(id, data);
  } catch (error) {
    if (error.code === 'P2002') {
      throw createError(409, 'A label with that name already exists for this user');
    }
    if (error.code === 'P2025') {
      throw createError(404, `Label ${id} not found`);
    }
    throw error;
  }
}

export async function deleteLabelById(id) {
  try {
    return await deleteLabel(id);
  } catch (error) {
    if (error.code === 'P2025') {
      throw createError(404, `Label ${id} not found`);
    }
    throw error;
  }
}
