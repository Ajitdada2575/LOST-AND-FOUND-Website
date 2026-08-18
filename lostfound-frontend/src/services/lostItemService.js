import { api } from './api';

export function getLostItems(filters) {
  return api.get('/lost', filters);
}

export function getLostItemById(id) {
  return api.get(`/lost/${id}`);
}

export function createLostItem(payload) {
  return api.post('/lost', payload);
}

export function updateLostItem(id, payload) {
  return api.put(`/lost/${id}`, payload);
}
