import { api } from './api';

// GET /api/notifications — documented in the spec.
export function getNotifications() {
  return api.get('/notifications');
}

export function markNotificationAsRead(id) {
  return api.put(`/notifications/${id}/read`);
}
