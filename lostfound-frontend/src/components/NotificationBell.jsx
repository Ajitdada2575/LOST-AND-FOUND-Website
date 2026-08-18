import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import * as notificationService from '../services/notificationService';

const TYPE_ICON = {
  POTENTIAL_MATCH: '🔍',
  CLAIM_SUBMITTED: '📨',
  CLAIM_APPROVED: '✅',
  ITEM_RETURNED: '📦',
  SYSTEM: '⚙️',
};

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  async function loadNotifications() {
    try {
      const data = await notificationService.getNotifications();
      setNotifications(Array.isArray(data) ? data : data?.notifications || []);
    } catch {
      // Silently ignore here; the full Notifications page surfaces errors.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  async function handleMarkRead(notification) {
    if (notification.is_read) return;
    try {
      await notificationService.markNotificationAsRead(notification.notification_id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.notification_id === notification.notification_id ? { ...n, is_read: true } : n
        )
      );
    } catch {
      // Leave state unchanged if the request fails.
    }
  }

  return (
    <div className="notification-bell" ref={ref}>
      <button
        className="bell-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-label={`Notifications, ${unreadCount} unread`}
      >
        🔔
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="bell-dropdown card">
          <div className="bell-dropdown-header">Notifications</div>

          {loading && <div className="loading-state">Loading…</div>}

          {!loading && notifications.length === 0 && (
            <div className="empty-state">You don't have any notifications yet.</div>
          )}

          {!loading && notifications.slice(0, 6).map((n) => (
            <button
              key={n.notification_id}
              className={`bell-item ${n.is_read ? '' : 'bell-item-unread'}`}
              onClick={() => handleMarkRead(n)}
            >
              <span className="bell-item-icon">{TYPE_ICON[n.notification_type] || '🔔'}</span>
              <span className="bell-item-body">
                <span className="bell-item-title">{n.title}</span>
                <span className="bell-item-message">{n.message}</span>
              </span>
            </button>
          ))}

          <Link to="/notifications" className="bell-dropdown-footer" onClick={() => setOpen(false)}>
            View all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
