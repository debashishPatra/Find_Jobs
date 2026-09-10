import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axiosConfig';
import WorkerCard from '../components/WorkerCard';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Workers() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') || '');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const [bookingWorker, setBookingWorker] = useState(null);
  const [workDate, setWorkDate] = useState('');
  const [workDescription, setWorkDescription] = useState('');
  const [bookingMsg, setBookingMsg] = useState('');

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  const loadWorkers = () => {
    setLoading(true);
    const params = {};
    if (categoryId) params.categoryId = categoryId;
    if (availableOnly) params.availableOnly = true;
    if (location) params.location = location;
    api.get('/workers', { params })
      .then((res) => setWorkers(res.data))
      .finally(() => setLoading(false));
  };

// eslint-disable-next-line react-hooks/exhaustive-deps
useEffect(() => { loadWorkers(); }, [categoryId, availableOnly, location]);

  const handleBookClick = (worker) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (worker.userId === user.userId) {
      setBookingMsg('You cannot book yourself.');
      return;
    }
    setBookingWorker(worker);
    setWorkDate('');
    setWorkDescription('');
    setBookingMsg('');
  };

  const submitBooking = async (e) => {
    e.preventDefault();
    setBookingMsg('');
    try {
      await api.post('/bookings', {
        workerId: bookingWorker.id,
        workDate,
        workDescription,
      });
      setBookingMsg('Booking request sent! Check "My Bookings" for status.');
      setBookingWorker(null);
    } catch (err) {
      setBookingMsg(err.response?.data?.error || 'Booking failed.');
    }
  };

  return (
    <div className="container">
      <h1>Find Skilled Workers</h1>

      <div className="filters">
        <select value={categoryId} onChange={(e) => { setCategoryId(e.target.value); setSearchParams(e.target.value ? { categoryId: e.target.value } : {}); }}>
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
        <input
          placeholder="Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} />
          Available only
        </label>
      </div>

      {bookingMsg && !bookingWorker && <div className="card">{bookingMsg}</div>}

      {bookingWorker && (
        <div className="card">
          <h3>Book {bookingWorker.fullName}</h3>
          <form onSubmit={submitBooking}>
            <div>
              <label>Work Date</label>
              <input type="date" value={workDate} onChange={(e) => setWorkDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
            </div>
            <div>
              <label>Describe the work</label>
              <textarea rows="3" value={workDescription} onChange={(e) => setWorkDescription(e.target.value)} placeholder="e.g. Fix kitchen sink leak" />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="primary" type="submit">Send Booking Request</button>
              <button className="secondary" type="button" onClick={() => setBookingWorker(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading workers...</p>
      ) : workers.length === 0 ? (
        <p>No workers found matching your filters.</p>
      ) : (
        <div className="grid">
          {workers.map((w) => (
            <WorkerCard key={w.id} worker={w} onBook={handleBookClick} />
          ))}
        </div>
      )}
    </div>
  );
}
