import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

const ICONS = {
  'Carpenter': '🔨',
  'Mistri (Mason)': '🧱',
  'Plumber': '🔧',
  'Electrician': '⚡',
  'Painter': '🎨',
  'Driver': '🚗',
  'Software Engineer': '💻',
  'Welder': '🔩',
  'Gardener': '🌱',
  'House Help': '🧹',
  'Mall Staff': '🏬',
  'Shop Keeper': '🏪',
  'Teacher': '📚',
  'Cab Driver (Auto)': '🛺',
  'Cab Driver (Car)': '🚕',
  'Cab Driver (Bike)': '🏍️',
};

function iconFor(name) {
  return ICONS[name] || '🛠️';
}

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <div style={{ background: '#0f172a', color: 'white', padding: '60px 16px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 34, marginBottom: 10 }}>Find skilled help, near you</h1>
        <p style={{ fontSize: 16, color: '#cbd5e1', maxWidth: 560, margin: '0 auto 24px' }}>
          Carpenters, plumbers, electricians, drivers, and more — registered, priced, and ready to book.
        </p>
        <button className="primary" onClick={() => navigate('/workers')}>Browse All Workers</button>
      </div>

      <div className="container">
        <h2 style={{ marginTop: 32 }}>Browse by Category</h2>
        <div className="grid">
          {categories.map((c) => (
            <div
              key={c.id}
              className="card"
              style={{ textAlign: 'center', cursor: 'pointer' }}
              onClick={() => navigate(`/workers?categoryId=${c.id}`)}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>{iconFor(c.name)}</div>
              <h3 style={{ margin: 0 }}>{c.name}</h3>
              {c.description && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{c.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
