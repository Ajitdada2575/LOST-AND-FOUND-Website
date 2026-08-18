import { api } from './api';

// POST /api/matches/lost/:lostId/generate
// Triggers backend generation. Response does NOT include match_id, so callers
// must follow up with getMatchesForLostItem() to get saved matches (with IDs).
export function generateMatches(lostItemId) {
  return api.post(`/matches/lost/${lostItemId}/generate`);
}

// GET /api/matches/lost/:lostId
// Returns a direct array of saved match objects (includes match_id).
// The backend is the sole source of truth for scores — this file never
// calculates or adjusts a score.
export function getMatchesForLostItem(lostItemId) {
  return api.get(`/matches/lost/${lostItemId}`);
}
