import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<Status>('loading');
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const token = params.get('token');
    const error = params.get('error');

    if (success === '1' && token) {
      localStorage.setItem('token', token);
      api.get('/users/me')
        .then(({ data }) => {
          setAuth(token, data);
          setStatus('success');
          setTimeout(() => navigate('/dashboard', { replace: true }), 2500);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setStatus('error');
        });
    } else if (error) {
      setStatus('error');
    } else {
      setStatus('error');
    }
  }, [navigate, setAuth]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, background: 'linear-gradient(135deg, var(--primary-light) 0%, #fde7f0 100%)',
    }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 440, padding: 48, textAlign: 'center' }}>

        {status === 'loading' && (
          <>
            <span className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
            <p style={{ marginTop: 20, color: 'var(--text-muted)' }}>Перевірка посилання…</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: 36,
            }}>
              ✓
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 10, color: '#166534' }}>Акаунт підтверджено!</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
              Ваша електронна пошта успішно підтверджена.<br />
              Ви автоматично увійдете в акаунт…
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
              <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />
              Перенаправлення на Dashboard…
            </div>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: 80, height: 80, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px', fontSize: 36,
            }}>
              ✕
            </div>
            <h2 style={{ fontSize: 24, marginBottom: 10, color: '#991b1b' }}>Посилання недійсне</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 28 }}>
              Посилання для підтвердження вже використано або закінчився його термін дії (24 години).
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link to="/login" className="btn btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
                Перейти до входу
              </Link>
              <Link to="/register" className="btn btn-outline" style={{ justifyContent: 'center', width: '100%' }}>
                Зареєструватися знову
              </Link>
            </div>
          </>
        )}

        <div style={{ marginTop: 32 }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'var(--primary)' }}>
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="var(--primary)" />
              <path d="M8 22L14 10L20 18L23 14L26 22H8Z" fill="white" opacity="0.9" />
              <circle cx="22" cy="12" r="3" fill="white" opacity="0.7" />
            </svg>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700 }}>Webster</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
