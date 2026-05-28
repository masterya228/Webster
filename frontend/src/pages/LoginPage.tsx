import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import GoogleButton from '../components/GoogleButton';
import Logo from '../components/Logo';
import api from '../api/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();

  // forgot-password state
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [forgotError, setForgotError] = useState('');

  const handleForgot = async (e: FormEvent) => {
    e.preventDefault();
    setForgotStatus('loading'); setForgotError('');
    try {
      await api.post('/auth/forgot-password', { email: forgotEmail });
      setForgotStatus('sent');
    } catch (err: any) {
      setForgotError(err?.response?.data?.message || 'Помилка. Спробуйте ще раз.');
      setForgotStatus('error');
    }
  };

  const searchParams = new URLSearchParams(window.location.search);
  const googleError = searchParams.get('error');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      const data = err.response?.data;
      if (data?.code === 'EMAIL_NOT_VERIFIED') {
        setUnverifiedEmail(data.email || email);
      } else {
        setUnverifiedEmail('');
        setError(data?.message || 'Невірний email або пароль');
      }
    }
  };

  const resend = async () => {
    setResendStatus('loading');
    try {
      await api.post('/auth/resend-verification', { email: unverifiedEmail });
      setResendStatus('sent');
      setTimeout(() => setResendStatus('idle'), 30000);
    } catch {
      setResendStatus('error');
      setTimeout(() => setResendStatus('idle'), 4000);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg, var(--primary-light) 0%, #fde7f0 100%)' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <Link to="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, textDecoration: 'none' }}>
          <Logo size={32} textSize={22} />
        </Link>

        {/* ── Forgot password panel ── */}
        {showForgot ? (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 6 }}>Скидання пароля</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Введіть email — ми надішлемо посилання для відновлення</p>

            {forgotStatus === 'sent' ? (
              <div style={{ background: '#d1fae5', border: '1px solid #6ee7b7', borderRadius: 10, padding: '20px 20px', textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>📬</div>
                <p style={{ color: '#065f46', fontWeight: 600, marginBottom: 4 }}>Лист надіслано!</p>
                <p style={{ color: '#047857', fontSize: 13 }}>Перевірте скриньку <strong>{forgotEmail}</strong>. Посилання дійсне 1 годину.</p>
              </div>
            ) : (
              <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label">Email</label>
                  <input className="input" type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="john@example.com" required autoFocus />
                </div>
                {forgotError && <p className="error-text">{forgotError}</p>}
                <button className="btn btn-primary" type="submit" disabled={forgotStatus === 'loading'} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                  {forgotStatus === 'loading' ? <span className="spinner" /> : 'Надіслати посилання'}
                </button>
              </form>
            )}

            <button onClick={() => { setShowForgot(false); setForgotStatus('idle'); setForgotError(''); }}
              style={{ width: '100%', marginTop: 16, background: 'none', border: 'none', color: 'var(--primary)', fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>
              ← Повернутись до входу
            </button>
          </>
        ) : (
        <>
        <h1 style={{ fontSize: 24, marginBottom: 6 }}>З поверненням</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Увійдіть, щоб продовжити роботу</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setUnverifiedEmail(''); setError(''); }} placeholder="john@example.com" required />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <label className="label" style={{ marginBottom: 0 }}>Пароль</label>
              <button type="button" onClick={() => { setShowForgot(true); setForgotEmail(email); setForgotStatus('idle'); }}
                style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: 12, cursor: 'pointer', fontWeight: 500, padding: 0 }}>
                Забули пароль?
              </button>
            </div>
            <input className="input" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Ваш пароль" required />
          </div>

          {error && <p className="error-text">{error}</p>}

          {unverifiedEmail && (
            <div style={{
              background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 'var(--radius-sm)',
              padding: '14px 16px',
            }}>
              <p style={{ color: '#92400e', fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>
                ⚠️ Акаунт <strong>{unverifiedEmail}</strong> ще не підтверджено.<br />
                Перевірте вашу пошту або отримайте новий лист.
              </p>
              <button
                type="button"
                onClick={resend}
                disabled={resendStatus === 'loading' || resendStatus === 'sent'}
                style={{
                  width: '100%', padding: '8px', borderRadius: 6,
                  border: '1.5px solid #f97316', background: 'transparent',
                  color: '#c2410c', fontSize: 13, fontWeight: 500, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}
              >
                {resendStatus === 'loading' && <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} />}
                {resendStatus === 'idle' && '📨 Надіслати лист підтвердження'}
                {resendStatus === 'loading' && 'Надсилання…'}
                {resendStatus === 'sent' && '✓ Лист надіслано! Перевірте пошту'}
                {resendStatus === 'error' && '⚠ Помилка. Спробуйте ще раз'}
              </button>
            </div>
          )}

          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? <span className="spinner" /> : 'Увійти'}
          </button>
        </form>

        {googleError === 'google_not_configured' && (
          <p className="error-text" style={{ marginTop: 12, textAlign: 'center' }}>
            Google OAuth не налаштований на сервері
          </p>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>АБО</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <GoogleButton label="Увійти через Google" />

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Немає акаунту?{' '}
          <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 500 }}>Зареєструватися безкоштовно</Link>
        </p>
        </>
        )}
      </div>
    </div>
  );
}
