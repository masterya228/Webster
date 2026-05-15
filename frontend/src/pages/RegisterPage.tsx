import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import GoogleButton from '../components/GoogleButton';
import Logo from '../components/Logo';
import api from '../api/client';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Пароль має містити щонайменше 6 символів'); return; }
    setLoading(true);
    try {
      await api.post('/auth/register', { email, name, password });
      setDone(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Помилка реєстрації');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg, var(--primary-light) 0%, #fde7f0 100%)' }}>
        <div className="card fade-in" style={{ width: '100%', maxWidth: 440, padding: 40, textAlign: 'center' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📧</div>
          <h2 style={{ marginBottom: 10, fontSize: 22 }}>Перевірте вашу пошту</h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 24 }}>
            Ми надіслали листа на <strong>{email}</strong>.<br />
            Натисніть посилання у листі, щоб активувати акаунт і увійти.
          </p>
          <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius)', padding: '16px 20px', marginBottom: 28, fontSize: 14, color: 'var(--primary)', lineHeight: 1.6 }}>
            💡 Не бачите листа? Перевірте папку <strong>Спам</strong> або натисніть кнопку нижче для повторного надсилання.
          </div>
          <ResendButton email={email} />
          <p style={{ marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
            <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>← Повернутись до входу</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'linear-gradient(135deg, var(--primary-light) 0%, #fde7f0 100%)' }}>
      <div className="card fade-in" style={{ width: '100%', maxWidth: 420, padding: 40 }}>
        <Link to="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: 32, textDecoration: 'none' }}>
          <Logo size={32} textSize={22} />
        </Link>

        <h1 style={{ fontSize: 24, marginBottom: 6 }}>Створіть акаунт</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: 28, fontSize: 14 }}>Починайте створювати дизайни безкоштовно</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label className="label">Повне ім'я</label>
            <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" required />
          </div>
          <div>
            <label className="label">Пароль</label>
            <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Щонайменше 6 символів" required />
          </div>
          {error && <p className="error-text">{error}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
            {loading ? <span className="spinner" /> : 'Зареєструватися'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>АБО</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <GoogleButton label="Зареєструватися через Google" />

        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'var(--text-muted)' }}>
          Вже маєте акаунт?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>Увійти</Link>
        </p>
      </div>
    </div>
  );
}

function ResendButton({ email }: { email: string }) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');

  const resend = async () => {
    setStatus('loading');
    try {
      await api.post('/auth/resend-verification', { email });
      setStatus('sent');
      setTimeout(() => setStatus('idle'), 30000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <button
      className="btn btn-outline"
      onClick={resend}
      disabled={status === 'loading' || status === 'sent'}
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {status === 'loading' && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
      {status === 'idle' && '📨 Надіслати лист повторно'}
      {status === 'loading' && 'Надсилання…'}
      {status === 'sent' && '✓ Лист надіслано! Перевірте пошту'}
      {status === 'error' && '⚠ Помилка. Спробуйте ще раз'}
    </button>
  );
}
