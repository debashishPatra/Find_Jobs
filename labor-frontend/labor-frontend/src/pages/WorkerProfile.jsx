import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

export default function WorkerProfile() {
  const [profile, setProfile] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/workers/me'), api.get('/categories')])
      .then(([profileRes, catRes]) => {
        setProfile(profileRes.data);
        setForm(profileRes.data);
        setCategories(catRes.data);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load profile'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      const payload = {
        price: Number(form.price),
        priceUnit: form.priceUnit,
        experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
        location: form.location,
        description: form.description,
        available: form.available,
        categoryId: Number(form.categoryId),
      };
      const res = await api.put('/workers/me', payload);
      setProfile(res.data);
      setForm(res.data);
      setSaved(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.');
    }
  };

  const toggleAvailability = async () => {
    try {
      const res = await api.patch('/workers/me/availability', { available: !profile.available });
      setProfile(res.data);
      setForm(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update availability');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (!profile || !form) return <div className="container"><div className="error">{error || 'Profile not found'}</div></div>;

  return (
    <div className="container">
      <h1>My Worker Profile</h1>

      <div className="card" style={{ maxWidth: 460 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span className={`badge ${profile.available ? 'available' : 'unavailable'}`}>
            {profile.available ? 'Available for work' : 'Currently unavailable'}
          </span>
          <button className="secondary" onClick={toggleAvailability}>
            Mark as {profile.available ? 'Unavailable' : 'Available'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {saved && <div className="card" style={{ background: '#dcfce7', color: '#166534' }}>Profile updated!</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Category / Trade</label>
            <select name="categoryId" value={form.categoryId} onChange={handleChange}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Price (₹)</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
          </div>
          <div>
            <label>Price Unit</label>
            <select name="priceUnit" value={form.priceUnit} onChange={handleChange}>
              <option value="PER_HOUR">Per Hour</option>
              <option value="PER_DAY">Per Day</option>
              <option value="PER_JOB">Per Job</option>
            </select>
          </div>
          <div>
            <label>Experience (years)</label>
            <input name="experienceYears" type="number" min="0" value={form.experienceYears || ''} onChange={handleChange} />
          </div>
          <div>
            <label>Location</label>
            <input name="location" value={form.location || ''} onChange={handleChange} />
          </div>
          <div>
            <label>About / Description</label>
            <textarea name="description" rows="3" value={form.description || ''} onChange={handleChange} />
          </div>
          <button className="primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
