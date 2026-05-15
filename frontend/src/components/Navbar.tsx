import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Logo from './Logo';
import DefaultAvatar from './DefaultAvatar';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      padding: '0 24px',
      height: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    }}>
      <Link to={user ? '/dashboard' : '/'} style={{ textDecoration: 'none' }}>
        <Logo size={30} textSize={19} />
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {user ? (
          <>
            <Link to="/dashboard" className="btn btn-ghost btn-sm">Dashboard</Link>
            <Link to="/editor/new" className="btn btn-primary btn-sm">+ Новий дизайн</Link>

            <Link to="/profile" title="Мій профіль" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              {user.avatar
                ? <img src={user.avatar} alt={user.name} style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', border: '2px solid #6c63ff' }} />
                : <DefaultAvatar size={36} />
              }
              <span style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{user.name.split(' ')[0]}</span>
            </Link>

            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Вийти</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-ghost btn-sm">Увійти</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Почати</Link>
          </>
        )}
      </div>
    </nav>
  );
}
