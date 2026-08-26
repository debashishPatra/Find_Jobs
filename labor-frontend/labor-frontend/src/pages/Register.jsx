import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  role: 'CUSTOMER',
  categoryId: '',
  price: '',
  priceUnit: 'PER_DAY',
  experienceYears: '',
  location: '',
  description: '',
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = { ...form };
      if (form.role === 'CUSTOMER') {
        delete payload.categoryId;
        delete payload.price;
        delete payload.priceUnit;
        delete payload.experienceYears;
        delete payload.location;
        delete payload.description;
      } else {
        payload.categoryId = Number(form.categoryId);
        payload.price = Number(form.price);
        payload.experienceYears = form.experienceYears ? Number(form.experienceYears) : null;
      }
      const res = await register(payload);
      navigate(res.role === 'WORKER' ? '/worker/profile' : '/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const isWorker = form.role === 'WORKER';

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 460 }}>
        <h2>Register</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>I am a</label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="CUSTOMER">Customer (looking to hire)</option>
              <option value="WORKER">Worker (looking for work)</option>
            </select>
          </div>
          <div>
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div>
            <label>Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={(e) => {
                const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
                setForm({ ...form, phone: digitsOnly });
              }}
              pattern="[6-9][0-9]{9}"
              title="Enter a valid 10-digit mobile number"
              maxLength={10}
              placeholder="10-digit mobile number"
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              title="At least 6 characters"
              placeholder="At least 6 characters"
              required
            />
          </div>

          {isWorker && (
            <>
              <div>
                <label>Category / Trade</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
                  <option value="">Select category</option>
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
                <input name="experienceYears" type="number" min="0" value={form.experienceYears} onChange={handleChange} />
              </div>
              <div>
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="City / Area" />
              </div>
              <div>
                <label>About / Description</label>
                <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
              </div>
            </>
          )}

          <button className="primary" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>
        <p style={{ fontSize: 14, marginTop: 12 }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
