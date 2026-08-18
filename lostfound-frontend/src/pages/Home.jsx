import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as lostItemService from '../services/lostItemService';
import * as foundItemService from '../services/foundItemService';

function PreviewCard({ item, type }) {
  const id = type === 'lost' ? item.lost_item_id : item.found_item_id;
  const dateField = type === 'lost' ? item.lost_date : item.found_date;
  return (
    <Link to={`/${type === 'lost' ? 'lost-items' : 'found-items'}?id=${id}`} className="card item-card">
      {item.image_url && <img src={item.image_url} alt={item.title} className="item-card-image" />}
      <div className="item-card-body">
        <div className="item-card-title-row">
          <h3>{item.title}</h3>
          <span className="badge badge-neutral">{item.status}</span>
        </div>
        {dateField && <p className="item-card-meta">{new Date(dateField).toLocaleDateString()}</p>}
        {item.description && <p className="item-card-desc">{item.description}</p>}
      </div>
    </Link>
  );
}

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    async function load() {
      try {
        const [lost, found] = await Promise.all([
          lostItemService.getLostItems(),
          foundItemService.getFoundItems(),
        ]);
        const lostList = Array.isArray(lost) ? lost : lost?.items || [];
        const foundList = Array.isArray(found) ? found : found?.items || [];
        setRecentLost(lostList.slice(0, 3));
        setRecentFound(foundList.slice(0, 3));
      } catch (err) {
        setError(err.message || 'Could not load recent items.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isAuthenticated]);

  return (
    <div>
      <section className="hero">
        <div className="container hero-inner">
          <h1>Find What Was Lost.<br />Return What Was Found.</h1>
          <p className="hero-subtitle">
            Report a lost or found item on campus, and let the matching system connect them for you.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/lost-items?new=1' : '/login'} className="btn btn-primary">
              I Lost Something
            </Link>
            <Link to={isAuthenticated ? '/found-items?new=1' : '/login'} className="btn btn-secondary">
              I Found Something
            </Link>
          </div>
        </div>
      </section>

      <div className="container page">
        {error && <div className="form-error-banner">{error}</div>}

        {!isAuthenticated ? (
          <div className="empty-state">
            <Link to="/login">Sign in</Link> to see recently reported lost and found items.
          </div>
        ) : (
          <>
            <section className="home-section">
              <div className="page-header">
                <h2>Recently reported lost items</h2>
                <Link to="/lost-items">View all</Link>
              </div>
              {loading ? (
                <div className="loading-state">Loading…</div>
              ) : recentLost.length === 0 ? (
                <div className="empty-state">No lost items reported yet.</div>
              ) : (
                <div className="grid">
                  {recentLost.map((item) => (
                    <PreviewCard key={item.lost_item_id} item={item} type="lost" />
                  ))}
                </div>
              )}
            </section>

            <section className="home-section">
              <div className="page-header">
                <h2>Recently reported found items</h2>
                <Link to="/found-items">View all</Link>
              </div>
              {loading ? (
                <div className="loading-state">Loading…</div>
              ) : recentFound.length === 0 ? (
                <div className="empty-state">No found items reported yet.</div>
              ) : (
                <div className="grid">
                  {recentFound.map((item) => (
                    <PreviewCard key={item.found_item_id} item={item} type="found" />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
