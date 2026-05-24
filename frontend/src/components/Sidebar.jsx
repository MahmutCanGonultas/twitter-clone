import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

const PersonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
  </svg>
);

function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">𝕏</div>
      <nav className="sidebar-nav">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <span className="nav-icon">
            <HomeIcon />
          </span>
          <span className="nav-label">Ana Sayfa</span>
        </Link>
        {user && (
          <Link
            to={`/profile/${user.username}`}
            className={`nav-item ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
          >
            <span className="nav-icon">
              <PersonIcon />
            </span>
            <span className="nav-label">Profil</span>
          </Link>
        )}
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.username}</div>
            <div className="sidebar-user-handle">@{user.username}</div>
          </div>
          <button
            className="sidebar-logout-btn"
            onClick={handleLogout}
            title="Çıkış yap"
          >
            <LogoutIcon />
          </button>
        </div>
      )}
    </aside>
  );
}

export default Sidebar;
