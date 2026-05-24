import { useState, FormEvent } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import api from '../api/client';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [password,  setPassword]  = useState('');
  const [confirm,   setConfirm]   = useState('');
  const [status,    setStatus]    = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error,     setError]     = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Мінімум 6 символів'); return; }
    if (password !== confirm) { setError('Паролі не збігаються'); return; }
    setStatus('loading');
    try {
      await api.post('/auth/reset-password', { token, password });
      setStatus('done');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Посилання недійсне або застаріло.');
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg, var(--primary-light) 0%, #fde7f0 100%)' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <Link to="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, textDecoration: 'none' }}>
          <Logo size={32} textSize={22} />
        </Link>

        {!token ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
              <h2 style={{ marginBottom: 8 }}>Невірне посилання</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Посилання для скидання пароля відсутнє або пошкоджене.</p>
            </div>
            <Link to="/login" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', padding: '12px' }}>
              Повернутись до входу
            </Link>
          </>
        ) : status === 'done' ? (
          <>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
              <h2 style={{ marginBottom: 8 }}>Пароль змінено!</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Тепер ви можете увійти з новим паролем.</p>
            </div>
            <button className="btn btn-primary" onClick={() => navigate('/login')} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
              Увійти
            </button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 24, marginBottom: 6 }}>Новий пароль</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Введіть новий пароль для вашого акаунту</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">Новий пароль</label>
                <input className="input" type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Мінімум 6 символів" required autoFocus />
              </div>
              <div>
                <label className="label">Підтвердження пароля</label>
                <input className="input" type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Повторіть пароль" required />
              </div>

              {error && <p className="error-text">{error}</p>}

              <button className="btn btn-primary" type="submit" disabled={status === 'loading'}
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                {status === 'loading' ? <span className="spinner" /> : 'Зберегти пароль'}
              </button>
            </form>

            <p style={{ textAlign: 'center', marginTop: 20, fontSize: 14 }}>
              <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>← Повернутись до входу</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
