import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import * as claimService from '../services/claimService';

const STATUS_ICON = {
  PENDING: '⏳',
  APPROVED: '✅',
  REJECTED: '❌',
  COMPLETED: '🎉',
};

const STATUS_COLOR = {
  PENDING: '#F59E0B',
  APPROVED: '#16A34A',
  REJECTED: '#DC2626',
  COMPLETED: '#0D9488',
};

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
      setActionMessage(`✓ Claim #${claim.claim_id} marked as ${status}.`);
      await loadClaims();
    } catch (err) {
      setError(err.message || 'Could not update this claim.');
    } finally {
      setReviewingId(null);
    }
  }

  return (
    <div className="page page-claims">
      <div className="container">
        <h1>{isAdmin ? '📋 Admin Claim Review' : '📋 My Claims'}</h1>

        {actionMessage && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{actionMessage}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        {loading ? (
          <div className="loading-state">Loading claims...</div>
        ) : claims.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">{isAdmin ? '📋' : '🔍'}</div>
            <h3>{isAdmin ? 'No Claims to Review' : 'No Claims Yet'}</h3>
            <p>
              {isAdmin
                ? 'There are no claims waiting for review.'
                : "You haven't submitted any claims yet. Find matches and submit claims!"}
            </p>
          </div>
        ) : (
          <div className="claims-list">
            {claims.map((claim) => (
              <div key={claim.claim_id} className="card claim-card">
                <div className="claim-status-row">
                  <h3 style={{ marginBottom: 0 }}>Claim #{claim.claim_id}</h3>
                  <span
                    className="badge"
                    style={{
                      background: STATUS_COLOR[claim.status] || '#9CA3AF',
                      color: 'white',
                    }}
                  >
                    {STATUS_ICON[claim.status]} {claim.status}
                  </span>
                </div>

                <div className="claim-details">
                  <div className="claim-detail-item">
                    <div className="claim-detail-label">Match ID</div>
                    <div style={{ fontWeight: 600 }}>{claim.match_id}</div>
                  </div>
                  {claim.lost_item_id !== undefined && (
                    <div className="claim-detail-item">
                      <div className="claim-detail-label">Lost Item</div>
                      <div style={{ fontWeight: 600 }}>#{claim.lost_item_id}</div>
                    </div>
                  )}
                  {claim.found_item_id !== undefined && (
                    <div className="claim-detail-item">
                      <div className="claim-detail-label">Found Item</div>
                      <div style={{ fontWeight: 600 }}>#{claim.found_item_id}</div>
                    </div>
                  )}
                  {claim.match_score !== undefined && (
                    <div className="claim-detail-item">
                      <div className="claim-detail-label">Match Score</div>
                      <div style={{ fontWeight: 600 }}>{claim.match_score}%</div>
                    </div>
                  )}
                  {claim.submitted_at && (
                    <div className="claim-detail-item">
                      <div className="claim-detail-label">Submitted</div>
                      <div style={{ fontWeight: 600 }}>{new Date(claim.submitted_at).toLocaleDateString()}</div>
                    </div>
                  )}
                  {isAdmin && claim.claimant_user_id !== undefined && (
                    <div className="claim-detail-item">
                      <div className="claim-detail-label">Claimant</div>
                      <div style={{ fontWeight: 600 }}>{claim.claimant_name || `User #${claim.claimant_user_id}`}</div>
                    </div>
                  )}
                </div>

                {claim.reviewer_comments && (
                  <div style={{ padding: 'var(--space-3)', background: 'var(--color-bg-tertiary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-3)' }}>
                    <div className="claim-detail-label">Reviewer Comments</div>
                    <p style={{ marginBottom: 0 }}>{claim.reviewer_comments}</p>
                  </div>
                )}

                {isAdmin && claim.status === 'PENDING' && (
                  <div className="claim-review-panel">
                    <div className="field">
                      <label>Comments (optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Add reviewer comments..."
                        value={comments[claim.claim_id] || ''}
                        onChange={(e) => setComments((prev) => ({ ...prev, [claim.claim_id]: e.target.value }))}
                      />
                    </div>
                    <div className="claim-review-actions">
                      <button
                        className="btn btn-primary"
                        onClick={() => handleReview(claim, 'APPROVED')}
                        disabled={reviewingId === claim.claim_id}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn"
                        style={{ background: '#DC2626', color: 'white' }}
                        onClick={() => handleReview(claim, 'REJECTED')}
                        disabled={reviewingId === claim.claim_id}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
