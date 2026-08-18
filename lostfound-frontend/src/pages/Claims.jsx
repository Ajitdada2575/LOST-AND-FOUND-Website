import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as claimService from '../services/claimService';

const STATUS_BADGE = {
  PENDING: 'badge-warning',
  APPROVED: 'badge-success',
  REJECTED: 'badge-danger',
  COMPLETED: 'badge-primary',
};

function StatusBadge({ status }) {
  return <span className={`badge ${STATUS_BADGE[status] || 'badge-neutral'}`}>{status}</span>;
}

export default function Claims() {
  const { isAdmin } = useAuth();
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [comments, setComments] = useState({});

  async function loadClaims() {
    setLoading(true);
    setError('');
    try {
      const data = isAdmin ? await claimService.getAllClaims() : await claimService.getMyClaims();
      setClaims(Array.isArray(data) ? data : data?.claims || []);
    } catch (err) {
      setError(err.message || 'Could not load claims.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  async function handleReview(claim, status) {
    setReviewingId(claim.claim_id);
    setActionMessage('');
    setError('');
    try {
      await claimService.reviewClaim(claim.claim_id, {
        status,
        reviewerComments: comments[claim.claim_id] || '',
      });
      setActionMessage(`Claim #${claim.claim_id} marked as ${status}.`);
      await loadClaims();
    } catch (err) {
      setError(err.message || 'Could not update this claim.');
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <div className="container page">
      <div className="page-header">
        <h1>{isAdmin ? 'Admin Claim Review' : 'My Claims'}</h1>
      </div>

      {actionMessage && <div className="form-success-banner">{actionMessage}</div>}
      {error && <div className="form-error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading claims…</div>
      ) : claims.length === 0 ? (
        <div className="empty-state">
          {isAdmin ? 'There are no claims to review yet.' : "You haven't submitted any claims yet."}
        </div>
      ) : (
        <div className="claims-list">
          {claims.map((claim) => (
            <div key={claim.claim_id} className="card claim-card">
              <div className="claim-card-header">
                <h3>Claim #{claim.claim_id}</h3>
                <StatusBadge status={claim.status} />
              </div>

              <div className="claim-details-grid">
                <div><span className="label">Match ID</span>{claim.match_id}</div>
                {claim.lost_item_id !== undefined && (
                  <div><span className="label">Lost Item</span>{claim.lost_item_id}</div>
                )}
                {claim.found_item_id !== undefined && (
                  <div><span className="label">Found Item</span>{claim.found_item_id}</div>
                )}
                {claim.match_score !== undefined && (
                  <div><span className="label">Match Score</span>{claim.match_score}%</div>
                )}
                {claim.match_classification && (
                  <div><span className="label">Classification</span>{claim.match_classification?.replaceAll('_', ' ')}</div>
                )}
                {isAdmin && claim.claimant_user_id !== undefined && (
                  <div><span className="label">Claimant</span>{claim.claimant_name || claim.claimant_user_id}</div>
                )}
                {claim.submitted_at && (
                  <div><span className="label">Submitted</span>{new Date(claim.submitted_at).toLocaleString()}</div>
                )}
                {claim.reviewed_at && (
                  <div><span className="label">Reviewed</span>{new Date(claim.reviewed_at).toLocaleString()}</div>
                )}
                {claim.reviewer_comments && (
                  <div className="claim-comments"><span className="label">Reviewer Comments</span>{claim.reviewer_comments}</div>
                )}
              </div>

              {isAdmin && claim.status === 'PENDING' && (
                <div className="claim-review-actions">
                  <textarea
                    placeholder="Reviewer comments (optional)"
                    rows={2}
                    value={comments[claim.claim_id] || ''}
                    onChange={(e) => setComments((prev) => ({ ...prev, [claim.claim_id]: e.target.value }))}
                  />
                  <div className="claim-review-buttons">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleReview(claim, 'APPROVED')}
                      disabled={reviewingId === claim.claim_id}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleReview(claim, 'REJECTED')}
                      disabled={reviewingId === claim.claim_id}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
