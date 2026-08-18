import { useEffect, useState } from 'react';
import * as notificationService from '../services/notificationService';

const TYPE_ICON = {
  POTENTIAL_MATCH: '🔍',
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
    <div className="container page">
      <div className="page-header">
        <h1>Notifications</h1>
      </div>

      {error && <div className="form-error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="empty-state">You don't have any notifications yet.</div>
      ) : (
        <div className="notifications-list">
          {notifications.map((n) => (
            <div
              key={n.notification_id}
              className={`card notification-row ${n.is_read ? 'notification-read' : 'notification-unread'}`}
            >
              <span className="notification-icon">{TYPE_ICON[n.notification_type] || '🔔'}</span>
              <div className="notification-body">
                <div className="notification-title-row">
                  <h3>{n.title}</h3>
                  {!n.is_read && <span className="badge badge-info">New</span>}
                </div>
                <p>{n.message}</p>
                <span className="notification-time">
                  {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                </span>
              </div>
              {!n.is_read && (
                <button className="btn btn-outline btn-sm" onClick={() => handleMarkRead(n)}>
                  Mark as read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
