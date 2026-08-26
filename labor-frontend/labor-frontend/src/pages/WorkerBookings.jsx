import React, { useEffect, useRef, useState } from 'react';
import api from '../api/axiosConfig';

export default function WorkerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sharingId, setSharingId] = useState(null);
  const watchIdRef = useRef(null);

  const load = () => {
    setLoading(true);
    api.get('/bookings/worker')
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update booking');
    }
  };

  const startSharing = (id) => {
    if (!navigator.geolocation) {
      setError('Your browser does not support location sharing.');
      return;
    }
    setSharingId(id);
    watchIdRef.current = navigator.geolocation.watchPosition(
      async (pos) => {
        try {
          await api.patch(`/bookings/${id}/location`, {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
        } catch (err) {
          // silently ignore transient errors during tracking
        }
      },
      (err) => setError('Location error: ' + err.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharingId(null);
  };

  return (
    <div className="container">
      <h1>Booking Requests</h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No booking requests yet.</p>
      ) : (
        bookings.map((b) => (
          <div className="card" key={b.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>{b.customerName}</h3>
                <div style={{ fontSize: 14, color: '#374151' }}>📞 {b.customerPhone}</div>
                <div style={{ fontSize: 14, color: '#374151' }}>📅 {b.workDate}</div>
                {b.workDescription && <div style={{ fontSize: 14, color: '#374151' }}>{b.workDescription}</div>}
                <div className="price" style={{ marginTop: 6 }}>₹{b.agreedPrice}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge status-${b.status}`}>{b.status}</span>
                {b.status === 'PENDING' && (
                  <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                    <button className="primary" onClick={() => updateStatus(b.id, 'ACCEPTED')}>Accept</button>
                    <button className="danger" onClick={() => updateStatus(b.id, 'REJECTED')}>Reject</button>
                  </div>
                )}
                {b.status === 'ACCEPTED' && (
                  <div style={{ marginTop: 10, display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <button className="secondary" onClick={() => updateStatus(b.id, 'COMPLETED')}>Mark Completed</button>
                    {sharingId === b.id ? (
                      <button className="danger" onClick={stopSharing}>Stop Sharing Location</button>
                    ) : (
                      <button className="secondary" onClick={() => startSharing(b.id)}>📍 Share Live Location</button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
