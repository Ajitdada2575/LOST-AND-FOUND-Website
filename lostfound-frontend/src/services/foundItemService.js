import { api } from './api';

export function getFoundItems(filters) {
  return api.get('/found', filters);
}

export function getFoundItemById(id) {
  return api.get(`/found/${id}`);
}

export function createFoundItem(payload) {
  return api.post('/found', payload);
}

export function updateFoundItem(id, payload) {
  return api.put(`/found/${id}`, payload);
}

// PUT /api/found/:id/return — documented in the spec.
export function markFoundItemReturned(id) {
  return api.put(`/found/${id}/return`);
}
