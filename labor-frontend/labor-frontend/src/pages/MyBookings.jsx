import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axiosConfig';

// Fix default marker icon paths (a well-known issue with react-leaflet bundlers)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    api.get('/bookings/my')
      .then((res) => setBookings(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load bookings'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // Poll every 10s so an accepted booking's live location stays fresh
    const interval = setInterval(load, 10000);
    return () => clearInterval(interval);
  }, []);

  const cancelBooking = async (id) => {
    try {
      await api.patch(`/bookings/${id}/status`, { status: 'CANCELLED' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to cancel booking');
    }
  };

  return (
    <div className="container">
      <h1>My Bookings</h1>
      {error && <div className="error">{error}</div>}
      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>You haven't booked anyone yet. Go browse workers!</p>
      ) : (
        bookings.map((b) => (
          <div className="card" key={b.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <h3>{b.workerName} <span style={{ color: '#6b7280', fontWeight: 400, fontSize: 14 }}>({b.categoryName})</span></h3>
                {b.workerPhone && <div style={{ fontSize: 14, color: '#374151' }}>📞 {b.workerPhone}</div>}
                <div style={{ fontSize: 14, color: '#374151' }}>📅 {b.workDate}</div>
                {b.workDescription && <div style={{ fontSize: 14, color: '#374151' }}>{b.workDescription}</div>}
                <div className="price" style={{ marginTop: 6 }}>₹{b.agreedPrice}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className={`badge status-${b.status}`}>{b.status}</span>
                {(b.status === 'PENDING' || b.status === 'ACCEPTED') && (
                  <div style={{ marginTop: 10 }}>
                    <button className="danger" onClick={() => cancelBooking(b.id)}>Cancel Booking</button>
                  </div>
                )}
              </div>
            </div>

            {b.status === 'ACCEPTED' && b.workerLat != null && b.workerLng != null && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}>
                  📍 Live location {b.locationUpdatedAt ? `· updated ${new Date(b.locationUpdatedAt).toLocaleTimeString()}` : ''}
                </div>
                <MapContainer
                  center={[b.workerLat, b.workerLng]}
                  zoom={14}
                  style={{ height: 250, width: '100%', borderRadius: 8 }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[b.workerLat, b.workerLng]}>
                    <Popup>{b.workerName} is here</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
