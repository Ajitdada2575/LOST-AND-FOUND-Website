import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as lostItemService from '../services/lostItemService';

const EMPTY_FORM = {
  title: '',
  description: '',
  category_id: '',
  location_id: '',
  lost_date: '',
  approximate_time: '',
  image_url: '',
};

export default function LostItems() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(searchParams.get('new') === '1');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function loadItems() {
    setLoading(true);
    setError('');
    try {
      const data = await lostItemService.getLostItems();
      setItems(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || 'Could not load lost items.');
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
    setEditingId(item.lost_item_id);
    setForm({
      title: item.title || '',
      description: item.description || '',
      category_id: item.category_id || '',
      location_id: item.location_id || '',
      lost_date: item.lost_date ? item.lost_date.slice(0, 10) : '',
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

    if (!form.title || !form.description || !form.lost_date) {
      setFormError('Title, description and lost date are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = { ...form };
      if (editingId) {
        await lostItemService.updateLostItem(editingId, payload);
      } else {
        await lostItemService.createLostItem(payload);
      }
      closeForm();
      await loadItems();
    } catch (err) {
      setFormError(err.message || 'Could not save the item. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container page">
      <div className="page-header">
        <h1>Lost Items</h1>
        <button className="btn btn-primary" onClick={openCreateForm}>
          + Report Lost Item
        </button>
      </div>

      <div className="field" style={{ maxWidth: 360 }}>
        <input
          placeholder="Search lost items…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="card form-panel">
          <div className="page-header">
            <h2>{editingId ? 'Edit Lost Item' : 'Report a Lost Item'}</h2>
            <button className="btn btn-outline btn-sm" onClick={closeForm}>
              Cancel
            </button>
          </div>

          {formError && <div className="form-error-banner">{formError}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" value={form.title} onChange={handleChange} />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={form.description}
                onChange={handleChange}
              />
            </div>
            <div className="form-row">
              <div className="field">
                <label htmlFor="lost_date">Lost date</label>
                <input
                  id="lost_date"
                  name="lost_date"
                  type="date"
                  value={form.lost_date}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="approximate_time">Approximate time</label>
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
                <label htmlFor="category_id">Category ID</label>
                <input
                  id="category_id"
                  name="category_id"
                  value={form.category_id}
                  onChange={handleChange}
                />
              </div>
              <div className="field">
                <label htmlFor="location_id">Location ID</label>
                <input
                  id="location_id"
                  name="location_id"
                  value={form.location_id}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label htmlFor="image_url">Image URL (optional)</label>
              <input id="image_url" name="image_url" value={form.image_url} onChange={handleChange} />
            </div>

            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving…' : editingId ? 'Save Changes' : 'Report Item'}
            </button>
          </form>
        </div>
      )}

      {error && <div className="form-error-banner">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading lost items…</div>
      ) : filteredItems.length === 0 ? (
        <div className="empty-state">No lost items found.</div>
      ) : (
        <div className="grid">
          {filteredItems.map((item) => (
            <div key={item.lost_item_id} className="card item-card">
              {item.image_url && <img src={item.image_url} alt={item.title} className="item-card-image" />}
              <div className="item-card-body">
                <div className="item-card-title-row">
                  <h3>{item.title}</h3>
                  <span className="badge badge-neutral">{item.status}</span>
                </div>
                {item.lost_date && (
                  <p className="item-card-meta">Lost on {new Date(item.lost_date).toLocaleDateString()}</p>
                )}
                <p className="item-card-desc">{item.description}</p>
                {item.user_id === user?.userId && (
                  <button className="btn btn-outline btn-sm" onClick={() => openEditForm(item)}>
                    Edit
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
