import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as lostItemService from '../services/lostItemService';
import * as matchService from '../services/matchService';
import * as claimService from '../services/claimService';

function classificationColor(classification) {
  switch (classification) {
    case 'VERY_STRONG_POTENTIAL_MATCH':
      return '#16A34A';
    case 'STRONG_POTENTIAL_MATCH':
      return '#0D9488';
    case 'POSSIBLE_MATCH':
      return '#F59E0B';
    default:
      return '#6B7280';
  }
}

export default function Matches() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [myLostItems, setMyLostItems] = useState([]);
  const [selectedLostItemId, setSelectedLostItemId] = useState(searchParams.get('lostItemId') || '');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [claimingMatchId, setClaimingMatchId] = useState(null);
  const [claimMessage, setClaimMessage] = useState('');

  useEffect(() => {
    async function loadLostItems() {
      try {
        const data = await lostItemService.getLostItems();
        setMyLostItems(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        setError(err.message || 'Could not load your lost items.');
      }
    }
    loadLostItems();
  }, []);

  async function loadSavedMatches(lostItemId) {
    if (!lostItemId) return;
    setLoading(true);
    setError('');
    try {
      const data = await matchService.getMatchesForLostItem(lostItemId);
      setMatches(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Could not load matches for this item.');
      setMatches([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (selectedLostItemId) loadSavedMatches(selectedLostItemId);
  }, [selectedLostItemId]);

  function handleSelectItem(e) {
    const id = e.target.value;
    setSelectedLostItemId(id);
    setClaimMessage('');
    setError('');
    setSearchParams(id ? { lostItemId: id } : {});
  }

  async function handleGenerateMatches() {
    if (!selectedLostItemId) return;
    setGenerating(true);
    setError('');
    setClaimMessage('');
    try {
      await matchService.generateMatches(selectedLostItemId);
      await loadSavedMatches(selectedLostItemId);
    } catch (err) {
      setError(err.message || 'Could not generate matches.');
    } finally {
      setGenerating(false);
    }
  }

  async function handleClaim(match) {
    if (!match.match_id) {
      setError('This match has no match ID yet. Try refreshing matches first.');
      return;
    }
    setClaimingMatchId(match.match_id);
    setClaimMessage('');
    setError('');
    try {
      await claimService.createClaim(match.match_id);
      setClaimMessage(`✅ Claim submitted for "${match.title}"!`);
    } catch (err) {
      setError(err.message || 'Could not submit claim.');
    } finally {
      setClaimingMatchId(null);
    }
  }

  return (
    <div className="page page-matches">
      <div className="container">
        <h1>🔗 Potential Matches</h1>

        <div className="card form-panel">
          <div className="field">
            <label htmlFor="lostItem">Select a lost item to find matches</label>
            <select id="lostItem" value={selectedLostItemId} onChange={handleSelectItem}>
              <option value="">Choose a lost item…</option>
              {myLostItems.map((item) => (
                <option key={item.lost_item_id} value={item.lost_item_id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={handleGenerateMatches}
            disabled={!selectedLostItemId || generating || loading}
          >
            {generating ? '⏳ Generating…' : '🔄 Refresh Matches'}
          </button>
        </div>

        {claimMessage && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{claimMessage}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        {!selectedLostItemId ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔗</div>
            <h3>Select a Lost Item</h3>
            <p>Choose one of your lost items to see potential matches with found items.</p>
          </div>
        ) : loading ? (
          <div className="loading-state">Searching for matches…</div>
        ) : matches.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">❌</div>
            <h3>No Matches Yet</h3>
            <p>No potential matches found for this item. Try again later!</p>
          </div>
        ) : (
          <div className="grid">
            {matches.map((match) => (
              <div key={match.match_id} className="card match-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <h3 style={{ marginBottom: 0 }}>{match.title}</h3>
                  <span
                    className="badge"
                    style={{
                      background: classificationColor(match.match_classification),
                      color: 'white',
                    }}
                  >
                    {match.match_classification?.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="match-score" style={{ marginBottom: 'var(--space-4)' }}>
                  {match.match_score}%
                </div>

                <div className="score-breakdown">
                  <div className="score-item">
                    <label>Category</label>
                    <span>{match.category_score}</span>
                  </div>
                  <div className="score-item">
                    <label>Color</label>
                    <span>{match.color_score}</span>
                  </div>
                  <div className="score-item">
                    <label>Brand</label>
                    <span>{match.brand_score}</span>
                  </div>
                  <div className="score-item">
                    <label>Location</label>
                    <span>{match.location_score}</span>
                  </div>
                  <div className="score-item">
                    <label>Date/Time</label>
                    <span>{match.datetime_score}</span>
                  </div>
                  <div className="score-item">
                    <label>Attributes</label>
                    <span>{match.specific_attribute_score}</span>
                  </div>
                </div>

                {match.description && <p style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--space-3)' }}>{match.description}</p>}

                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                  📅 {match.found_date && new Date(match.found_date).toLocaleDateString()}
                  {match.approximate_time && ` · ⏰ ${match.approximate_time}`}
                  {match.status && ` · ${match.status}`}
                </p>

                <button
                  className="btn btn-primary"
                  onClick={() => handleClaim(match)}
                  disabled={claimingMatchId === match.match_id}
                  style={{ width: '100%' }}
                >
                  {claimingMatchId === match.match_id ? '⏳ Submitting…' : '✓ Submit Claim'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
