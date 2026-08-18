import { api } from './api';

// { match_id } -> { message, claimId, matchId }
export function createClaim(matchId) {
  return api.post('/claims', { match_id: matchId });
}

export function getMyClaims() {
  return api.get('/claims/my');
}

export function getAllClaims() {
  return api.get('/claims');
}

// PUT /api/claims/:id/review — documented in the spec.
export function reviewClaim(claimId, { status, reviewerComments }) {
  return api.put(`/claims/${claimId}/review`, {
    status,
    reviewer_comments: reviewerComments,
  });
}
