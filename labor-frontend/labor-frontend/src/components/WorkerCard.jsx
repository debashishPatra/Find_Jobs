import React from 'react';

const UNIT_LABEL = {
  PER_HOUR: '/ hour',
  PER_DAY: '/ day',
  PER_JOB: '/ job',
};

export default function WorkerCard({ worker, onBook }) {
  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3>{worker.fullName}</h3>
          <div style={{ color: '#6b7280', fontSize: 13 }}>{worker.categoryName}</div>
        </div>
        <span className={`badge ${worker.booked ? 'status-ACCEPTED' : worker.available ? 'available' : 'unavailable'}`}>
          {worker.booked ? 'Booked' : worker.available ? 'Available' : 'Unavailable'}
        </span>
      </div>

      <p style={{ fontSize: 14, color: '#374151' }}>{worker.description || 'No description provided.'}</p>

      <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>
        {worker.location && <div>📍 {worker.location}</div>}
        {worker.experienceYears != null && <div>🧰 {worker.experienceYears} yrs experience</div>}
        {worker.phone && <div>📞 {worker.phone}</div>}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span className="price">₹{worker.price} {UNIT_LABEL[worker.priceUnit]}</span>
        {onBook && (
          <button className="primary" disabled={!worker.available || worker.booked} onClick={() => onBook(worker)}>
            {worker.booked ? 'Booked' : worker.available ? 'Book Now' : 'Unavailable'}
          </button>
        )}
      </div>
    </div>
  );
}
