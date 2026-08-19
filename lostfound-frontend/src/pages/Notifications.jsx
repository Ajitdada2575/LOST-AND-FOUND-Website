import { useEffect, useState } from 'react';
import * as notificationService from '../services/notificationService';

const TYPE_ICON = {
  POTENTIAL_MATCH: '🔗',
  CLAIM_SUBMITTED: '📨',
  CLAIM_APPROVED: '✅',
  ITEM_RETURNED: '📦',
  SYSTEM: '⚙️',
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadNotifications() {
    setLoading(true);
    setError('');
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : data?.notifications || []);
    } catch (err) {
      setError(err.message || 'Could not load notifications.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  async function handleMarkRead(notification) {
    if (notification.is_read) return;
    try {
      await notificationService.markNotificationAsRead(notification.notification_id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notification.notification_id ? { ...n, is_read: true } : n
        )
      );
    } catch (err) {
      setError(err.message || 'Could not mark notification as read.');
    }
  }

  return (
    <div className="page page-notifications">
      <div className="container">
        <h1>🔔 Notifications</h1>

        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <h3>All Caught Up!</h3>
            <p>You don't have any notifications right now.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {notifications.map((n) => (
              <div
                key={n.notification_id}
                className="notification-item"
                style={{
                  background: n.is_read ? 'var(--color-surface)' : 'var(--color-primary-50)',
                  borderLeft: `4px solid ${n.is_read ? 'var(--color-border)' : 'var(--color-primary-700)'}`,
                }}
              >
                <span className="notification-icon">{TYPE_ICON[n.notification_type] || '🔔'}</span>
                <div className="notification-content" style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                    <h3 style={{ marginBottom: 0 }}>{n.title}</h3>
                    {!n.is_read && <span className="badge badge-pending">NEW</span>}
                  </div>
                  <p style={{ marginBottom: 'var(--space-1)' }}>{n.message}</p>
                  <span className="notification-time">
                    {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                  </span>
                </div>
                {!n.is_read && (
                  <button className="btn btn-secondary btn-sm" onClick={() => handleMarkRead(n)}>
                    Mark as read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
