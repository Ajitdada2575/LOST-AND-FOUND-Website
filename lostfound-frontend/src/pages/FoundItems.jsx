import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as foundItemService from '../services/foundItemService';
import { CATEGORIES, LOCATIONS } from '../constants/itemOptions';

const EMPTY_FORM = {
  title: '',
  description: '',
  category_id: '',
  location_id: '',
  found_date: '',
  approximate_time: '',
  image_url: '',
};

export default function FoundItems() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [returningId, setReturningId] = useState(null);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const data = await foundItemService.getFoundItems();
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Could not load found items.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const q = search.toLowerCase();
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)
    );
  }, [items, search]);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setShowForm(true);
  }

  function openEditForm(item) {
    setEditingId(item.found_item_id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      category_id: item.category_id || '',
      location_id: item.location_id || '',
      found_date: item.found_date ? item.found_date.slice(0, 10) : '',
      approximate_time: item.approximate_time || '',
      image_url: item.image_url || '',
    });
    setFormError('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setSearchParams({});
  }

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    if (!form.title || !form.description || !form.found_date) {
      setFormError('Title, description and found date are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (editingId) {
        await foundItemService.updateFoundItem(editingId, payload);
      } else {
        await foundItemService.createFoundItem(payload);
      }
      closeForm();
      await loadItems();
    } catch (err) {
      setFormError(err.message || 'Could not save the item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleMarkReturned(item) {
    setActionMessage('');
    setReturningId(item.found_item_id);
    try {
      await foundItemService.markFoundItemReturned(item.found_item_id);
      setActionMessage(`✅ "${item.title}" was marked as returned!`);
      await loadItems();
    } catch (err) {
      setError(err.message || 'Could not mark this item as returned.');
    } finally {
      setReturningId(null);
    }
  }

  return (
    <div className="page page-found-items">
      <div className="container">
        <div className="page-header">
          <h1>Found Items</h1>
          <button className="btn btn-found" onClick={openCreateForm}>
            ➕ Report Found Item
          </button>
        </div>

        {showForm && (
          <div className="card form-panel">
            <div className="page-header">
              <h2>{editingId ? 'Edit Found Item' : 'Report a Found Item'}</h2>
              <button className="btn btn-secondary btn-sm" onClick={closeForm}>
                Cancel
              </button>
            </div>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="field">
                  <label htmlFor="title">Item Title *</label>
                  <input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Black Leather Wallet"
                  />
                </div>
                <div className="field">
                  <label htmlFor="category_id">Category</label>
                  <select
                    id="category_id"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a category…</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (ID {c.id})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="field">
                <label htmlFor="description">Description *</label>
                <textarea
                  id="description"
                  name="description"
                  rows={3}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the item in detail..."
                />
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="found_date">Found Date *</label>
                  <input
                    id="found_date"
                    name="found_date"
                    type="date"
                    value={form.found_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="field">
                  <label htmlFor="approximate_time">Approximate Time</label>
                  <input
                    id="approximate_time"
                    name="approximate_time"
                    type="time"
                    value={form.approximate_time}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="field">
                  <label htmlFor="location_id">Location</label>
                  <select
                    id="location_id"
                    name="location_id"
                    value={form.location_id}
                    onChange={handleChange}
                  >
                    <option value="">Select a location…</option>
                    {LOCATIONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name} (ID {l.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="field">
                  <label htmlFor="image_url">Image URL</label>
                  <input
                    id="image_url"
                    name="image_url"
                    value={form.image_url}
                    onChange={handleChange}
                    placeholder="https://..."
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: '120px' }}>
                {submitting ? 'Saving…' : editingId ? 'Update Item' : 'Report Item'}
              </button>
            </form>
          </div>
        )}

        {actionMessage && <div className="alert alert-success" style={{ marginBottom: 'var(--space-4)' }}>{actionMessage}</div>}
        {error && <div className="alert alert-error" style={{ marginBottom: 'var(--space-4)' }}>{error}</div>}

        <div className="search-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search found items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading found items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🟢</div>
            <h3>{search ? 'No matches found' : 'No found items yet'}</h3>
            <p>{search ? 'Try a different search' : 'Help reunite found items with their owners'}</p>
            {!search && (
              <button className="btn btn-found" onClick={openCreateForm} style={{ marginTop: 'var(--space-3)' }}>
                Report Found Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid">
            {filteredItems.map((item) => (
              <div key={item.found_item_id} className="card card-found item-card">
                {item.image_url && <img src={item.image_url} alt={item.title} className="item-card-image" />}
                <div className="item-card-body">
                  <div className="item-card-header">
                    <h3>{item.title}</h3>
                    <span className={`badge ${item.status === 'RETURNED' ? 'badge-success' : 'badge-found'}`}>
                      {item.status === 'RETURNED' ? '✓ Returned' : '🟢 Found'}
                    </span>
                  </div>
                  <div className="item-card-meta">
                    📅 {item.found_date ? new Date(item.found_date).toLocaleDateString() : 'Unknown'}
                    {item.approximate_time && ` · ⏰ ${item.approximate_time}`}
                  </div>
                  <p className="item-card-description">{item.description}</p>
                  {item.user_id === user?.userId && (
                    <div className="item-card-actions">
                      <button className="btn btn-secondary btn-sm" onClick={() => openEditForm(item)}>
                        ✏️ Edit
                      </button>
                      {item.status !== 'RETURNED' && (
                        <button
                          className="btn btn-found btn-sm"
                          onClick={() => handleMarkReturned(item)}
                          disabled={returningId === item.found_item_id}
                        >
                          {returningId === item.found_item_id ? 'Marking…' : '✓ Mark Returned'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
