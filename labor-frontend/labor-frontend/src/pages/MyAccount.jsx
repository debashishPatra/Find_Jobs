import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

export default function MyAccount() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ fullName: '', phone: '' });
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/users/me')
      .then((res) => {
        setForm({ fullName: res.data.fullName, phone: res.data.phone });
        setEmail(res.data.email);
      })
      .catch((err) => setError(err.response?.data?.error || 'Failed to load profile'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleChange = (e) => {
    if (e.target.name === 'phone') {
      const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
      setForm({ ...form, phone: digitsOnly });
      return;
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaved(false);
    try {
      const res = await api.put('/users/me', form);
      setSaved(true);
      if (refreshUser) refreshUser({ fullName: res.data.fullName });
    } catch (err) {
      setError(err.response?.data?.error || 'Update failed.');
    }
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <h1>My Account</h1>
      <div className="card" style={{ maxWidth: 420 }}>
        {error && <div className="error">{error}</div>}
        {saved && <div className="card" style={{ background: '#dcfce7', color: '#166534' }}>Account updated!</div>}

        <form onSubmit={handleSubmit}>
          <div>
            <label>Email (cannot be changed)</label>
            <input value={email} disabled style={{ background: '#f3f4f6', color: '#6b7280' }} />
          </div>
          <div>
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit mobile number"
              maxLength={10}
              required
            />
          </div>
          <button className="primary" type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
}
