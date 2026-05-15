import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (!token) { navigate('/login', { replace: true }); return; }

    localStorage.setItem('token', token);
    api.get('/users/me')
      .then(({ data }) => {
        setAuth(token, data);
        navigate('/dashboard', { replace: true });
      })
      .catch(() => {
        localStorage.removeItem('token');
        navigate('/login', { replace: true });
      });
  }, [navigate, setAuth]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <span className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }} />
        <p style={{ marginTop: 16, color: 'var(--text-muted)' }}>Вхід через Google…</p>
      </div>
    </div>
  );
}
