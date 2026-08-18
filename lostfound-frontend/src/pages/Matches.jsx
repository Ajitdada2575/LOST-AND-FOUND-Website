import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import * as lostItemService from '../services/lostItemService';
import * as matchService from '../services/matchService';
import * as claimService from '../services/claimService';

function classificationBadgeClass(classification) {
  switch (classification) {
    case 'VERY_STRONG_POTENTIAL_MATCH':
      return 'badge-success';
    case 'STRONG_POTENTIAL_MATCH':
      return 'badge-primary';
    case 'POSSIBLE_MATCH':
      return 'badge-warning';
    default:
      return 'badge-neutral';
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

  // GET /api/matches/lost/:lostId — returns a direct array of saved matches.
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

  // POST /api/matches/lost/:lostId/generate does not return match_id, so once
  // generation succeeds we re-fetch the saved matches to get IDs for claiming.
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
      setClaimMessage(`Claim submitted for "${match.title}".`);
    } catch (err) {
      setError(err.message || 'Could not submit claim.');
    } finally {
      setClaimingMatchId(null);
    }
  }

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Potential Matches</h1>
      </div>

      <div className="card form-panel">
        <div className="field">
          <label htmlFor="lostItem">Select one of your lost items</label>
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
          className="btn btn-secondary btn-sm"
          onClick={handleGenerateMatches}
          disabled={!selectedLostItemId || generating || loading}
        >
          {generating ? 'Generating…' : 'Refresh Matches'}
        </button>
      </div>

      {claimMessage && <div className="form-success-banner">{claimMessage}</div>}
      {error && <div className="form-error-banner">{error}</div>}

      {!selectedLostItemId ? (
        <div className="empty-state">Select a lost item above to see its potential matches.</div>
      ) : loading ? (
        <div className="loading-state">Loading matches…</div>
      ) : matches.length === 0 ? (
        <div className="empty-state">No potential matches found for this item yet.</div>
      ) : (
        <div className="grid">
          {matches.map((match) => (
            <div key={match.match_id} className="card match-card">
              <div className="match-card-header">
                <h3>{match.title}</h3>
                <span className={`badge ${classificationBadgeClass(match.match_classification)}`}>
                  {match.match_classification?.replaceAll('_', ' ')}
                </span>
              </div>

              <div className="match-score-display">
                <span className="match-score-number">{match.match_score}%</span>
              </div>

              <ul className="match-score-breakdown">
                <li>Category <span>{match.category_score}</span></li>
                <li>Color <span>{match.color_score}</span></li>
                <li>Brand <span>{match.brand_score}</span></li>
                <li>Location <span>{match.location_score}</span></li>
                <li>Date/Time <span>{match.datetime_score}</span></li>
                <li>Attributes <span>{match.specific_attribute_score}</span></li>
                <li>Description <span>{match.description_score}</span></li>
              </ul>

              {match.description && <p className="item-card-desc">{match.description}</p>}

              <p className="item-card-meta">
                {match.found_date && new Date(match.found_date).toLocaleDateString()}
                {match.approximate_time && ` · ${match.approximate_time}`}
                {match.status && ` · ${match.status}`}
              </p>

              <button
                className="btn btn-primary btn-sm"
                onClick={() => handleClaim(match)}
                disabled={claimingMatchId === match.match_id}
              >
                {claimingMatchId === match.match_id ? 'Submitting…' : 'Submit Claim'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
