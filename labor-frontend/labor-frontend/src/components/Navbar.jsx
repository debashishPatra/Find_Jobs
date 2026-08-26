import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="navbar">
      <Link to="/" className="brand">🛠️ FindJobs</Link>
      <div className="links">
        <Link to="/workers">Browse Workers</Link>
        {user && <Link to="/my-bookings">My Bookings</Link>}
        {user?.role === 'WORKER' && <Link to="/worker/profile">My Profile</Link>}
        {user?.role === 'WORKER' && <Link to="/worker/bookings">Booking Requests</Link>}
        {user && <Link to="/my-account">My Account</Link>}
        {!user && <Link to="/login">Login</Link>}
        {!user && <Link to="/register">Register</Link>}
        {user && (
          <>
            <span>Hi, {user.fullName}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
