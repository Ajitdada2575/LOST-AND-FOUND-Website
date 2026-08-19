import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as lostItemService from '../services/lostItemService';
import * as foundItemService from '../services/foundItemService';
import './HowItWorks.css';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [stats, setStats] = useState({ lost: 0, found: 0, matches: 0 });
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [lost, found] = await Promise.all([
          lostItemService.getLostItems(),
          foundItemService.getFoundItems(),
        ]);

        const lostList = Array.isArray(lost) ? lost : lost?.items || [];
        const foundList = Array.isArray(found) ? found : found?.items || [];

        setStats({
          lost: lostList.length,
          found: foundList.length,
          matches: Math.min(lostList.length, foundList.length),
        });

        setRecentLost(lostList.slice(0, 3));
        setRecentFound(foundList.slice(0, 3));
      } catch (err) {
        setError(err.message || 'Could not load data');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="page-home" style={{ display: "flex", flexDirection: "column", minHeight: "calc(100vh - 80px)" }}>
      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <h1>Lost Something? We'll Help You Find It.</h1>
          <p>
            Connect lost and found items through our intelligent matching system. Join your
            community in reuniting belongings with their owners.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/lost-items?new=1" className="btn btn-lost btn-lg">
                  📋 Report Lost Item
                </Link>
                <Link to="/found-items?new=1" className="btn btn-found btn-lg">
                  📦 Report Found Item
                </Link>
                <Link to="/matches" className="btn btn-primary btn-lg">
                  🔗 View Matches
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/register" className="btn btn-secondary btn-lg">
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How It Works CTA */}
      <section className="container" style={{ paddingTop: 'var(--space-6)' }}>
        <div className="hiw-home-cta">
          <div className="hiw-home-cta-text">
            <h3>New here? See How It Works</h3>
            <p>A quick step-by-step guide to reporting, matching, claiming, and recovering items.</p>
          </div>
          <Link to="/how-it-works" className="btn btn-primary">
            ℹ️ How It Works
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      {isAuthenticated && !loading && (
        <section className="page container" style={{ paddingTop: 'var(--space-6)' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>Platform Overview</h2>
          <div className="stats-grid">
            <div className="card stat-card">
              <div className="stat-icon">🔴</div>
              <div className="stat-label">Lost Items</div>
              <div className="stat-value">{stats.lost}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon">🟢</div>
              <div className="stat-label">Found Items</div>
              <div className="stat-value">{stats.found}</div>
            </div>
            <div className="card stat-card">
              <div className="stat-icon">🔗</div>
              <div className="stat-label">Potential Matches</div>
              <div className="stat-value">{stats.matches}</div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Items */}
      {isAuthenticated && (
        <section className="page container" style={{ flex: 1 }}>
          {error && <div className="alert alert-error">{error}</div>}

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <div className="page-header">
              <h2>Recently Lost Items</h2>
              <Link to="/lost-items" style={{ fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">Loading items...</div>
            ) : recentLost.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔍</div>
                <h3>No Lost Items Yet</h3>
                <p>Be the first to report a lost item in your community.</p>
                <Link to="/lost-items?new=1" className="btn btn-lost" style={{ marginTop: 'var(--space-3)' }}>
                  Report Lost Item
                </Link>
              </div>
            ) : (
              <div className="grid">
                {recentLost.map((item) => (
                  <div key={item.lost_item_id} className="card card-lost item-card">
                    {item.image_url && <img src={item.image_url} alt={item.title} className="item-card-image" />}
                    <div className="item-card-body">
                      <div className="item-card-header">
                        <h3>{item.title}</h3>
                        <span className="badge badge-lost">🟠 Lost</span>
                      </div>
                      <div className="item-card-meta">
                        📅 {item.lost_date ? new Date(item.lost_date).toLocaleDateString() : 'Unknown date'}
                      </div>
                      <p className="item-card-description">{item.description}</p>
                      <Link to={`/lost-items?id=${item.lost_item_id}`} className="btn btn-secondary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="page-header">
              <h2>Recently Found Items</h2>
              <Link to="/found-items" style={{ fontWeight: 600 }}>
                View All →
              </Link>
            </div>

            {loading ? (
              <div className="loading-state">Loading items...</div>
            ) : recentFound.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">📦</div>
                <h3>No Found Items Yet</h3>
                <p>Help reunite found items with their owners.</p>
                <Link to="/found-items?new=1" className="btn btn-found" style={{ marginTop: 'var(--space-3)' }}>
                  Report Found Item
                </Link>
              </div>
            ) : (
              <div className="grid">
                {recentFound.map((item) => (
                  <div key={item.found_item_id} className="card card-found item-card">
                    {item.image_url && <img src={item.image_url} alt={item.title} className="item-card-image" />}
                    <div className="item-card-body">
                      <div className="item-card-header">
                        <h3>{item.title}</h3>
                        <span className="badge badge-found">🟢 Found</span>
                      </div>
                      <div className="item-card-meta">
                        📅 {item.found_date ? new Date(item.found_date).toLocaleDateString() : 'Unknown date'}
                      </div>
                      <p className="item-card-description">{item.description}</p>
                      <Link to={`/found-items?id=${item.found_item_id}`} className="btn btn-secondary btn-sm">
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Not Authenticated */}
      {!isAuthenticated && (
        <section className="page container" style={{ flex: 1 }}>
          <div className="empty-state">
            <div className="empty-state-icon">🔐</div>
            <h3>Sign In to Get Started</h3>
            <p>Create an account or log in to report lost items and find matches.</p>
            <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/login" className="btn btn-primary">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
