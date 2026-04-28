import {
  createLabelForUser,
  deleteLabelById,
  getLabel,
  listLabels,
  updateLabelById,
} from '../services/labelService.js';
import { serializeLabel } from '../utils/serializers.js';

export async function listLabelsHandler(req, res) {
  const labels = await listLabels(req.user);
  return res.status(200).json(labels.map(serializeLabel));
}

export async function getLabelHandler(req, res) {
  const label = await getLabel(Number(req.params.id));
  return res.status(200).json(serializeLabel(label));
}

export async function createLabelHandler(req, res) {
  const label = await createLabelForUser(req.user, req.body);
  return res.status(201).json(serializeLabel(label));
}

export async function updateLabelHandler(req, res) {
  const label = await updateLabelById(Number(req.params.id), req.body);
  return res.status(200).json(serializeLabel(label));
}

export async function deleteLabelHandler(req, res) {
  const label = await deleteLabelById(Number(req.params.id));
  return res.status(200).json({
    id: label.id,
    message: 'Label deleted successfully',
  });
}
