import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="navbar-brand">
          <span>🔍</span>
          Lost & Found
        </NavLink>

        <nav className="navbar-nav">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            Home
          </NavLink>
          <NavLink to="/lost-items" className={({ isActive }) => (isActive ? 'active' : '')}>
            Lost Items
          </NavLink>
          <NavLink to="/found-items" className={({ isActive }) => (isActive ? 'active' : '')}>
            Found Items
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/matches" className={({ isActive }) => (isActive ? 'active' : '')}>
              Matches
            </NavLink>
          )}
          {isAuthenticated && (
            <NavLink to="/claims" className={({ isActive }) => (isActive ? 'active' : '')}>
              My Claims
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/claims" className={({ isActive }) => (isActive ? 'active' : '')}>
              Admin
            </NavLink>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <span className="navbar-user">{user?.name}</span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="btn btn-secondary btn-sm">
                Login
              </NavLink>
              <NavLink to="/register" className="btn btn-primary btn-sm">
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
