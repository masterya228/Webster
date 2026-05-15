import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DefaultAvatar from '../components/DefaultAvatar';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const [name, setName]               = useState(user?.name || '');
  const [email, setEmail]             = useState(user?.email || '');
  const [currentPw, setCurrentPw]     = useState('');
  const [newPw, setNewPw]             = useState('');
  const [confirmPw, setConfirmPw]     = useState('');
  const [saving, setSaving]           = useState(false);
  const [savingPw, setSavingPw]       = useState(false);
  const [uploadingAvatar, setUploading] = useState(false);
  const [removingAvatar, setRemoving]   = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');
  const [errorMsg, setErrorMsg]       = useState('');
  const [pwSuccess, setPwSuccess]     = useState('');
  const [pwError, setPwError]         = useState('');

  const fileRef = useRef<HTMLInputElement>(null);

  const avatarUrl = user?.avatar
    ? (user.avatar.startsWith('http') ? user.avatar : user.avatar)
    : null;

  const flash = (setMsg: (m: string) => void, msg: string) => {
    setMsg(msg);
    setTimeout(() => setMsg(''), 3000);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setErrorMsg('');
    try {
      const { data } = await api.patch('/users/me', { name, email });
      updateUser(data);
      flash(setSuccessMsg, 'Профіль оновлено');
    } catch (e: any) {
      flash(setErrorMsg, e?.response?.data?.message || 'Помилка збереження');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (newPw !== confirmPw) { flash(setPwError, 'Паролі не збігаються'); return; }
    if (newPw.length < 6) { flash(setPwError, 'Мінімум 6 символів'); return; }
    setSavingPw(true);
    try {
      await api.patch('/users/me', { currentPassword: currentPw, newPassword: newPw });
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      flash(setPwSuccess, 'Пароль змінено');
    } catch (e: any) {
      flash(setPwError, e?.response?.data?.message || 'Невірний поточний пароль');
    } finally {
      setSavingPw(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setRemoving(true);
    try {
      const { data } = await api.delete('/users/avatar');
      updateUser(data);
      flash(setSuccessMsg, 'Аватар видалено');
    } catch {
      flash(setErrorMsg, 'Помилка видалення аватару');
    } finally {
      setRemoving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const { data } = await api.patch('/users/avatar', { avatar: dataUrl });
      updateUser(data);
      flash(setSuccessMsg, 'Аватар оновлено');
    } catch {
      flash(setErrorMsg, 'Помилка завантаження аватару');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const inp = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid var(--border)', fontSize: 14,
    background: 'var(--bg)', color: 'var(--text)', outline: 'none',
  } as React.CSSProperties;

  const section = (title: string, children: React.ReactNode) => (
    <div className="card" style={{ padding: 28, marginBottom: 20 }}>
      <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--border)' }}>{title}</h3>
      {children}
    </div>
  );

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ maxWidth: 640, padding: '40px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dashboard')}>← Назад</button>
          <h1 style={{ fontSize: 24, fontWeight: 700 }}>Мій профіль</h1>
        </div>

        {section('Аватар', (
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ position: 'relative' }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: 88, height: 88, borderRadius: '50%', objectFit: 'cover', border: '3px solid #6c63ff' }} />
                : <DefaultAvatar size={88} />
              }
              {(uploadingAvatar || removingAvatar) && (
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="spinner" style={{ width: 24, height: 24, borderWidth: 2, borderColor: '#fff transparent transparent' }} />
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button className="btn btn-primary btn-sm" onClick={() => fileRef.current?.click()} disabled={uploadingAvatar || removingAvatar}>
                {uploadingAvatar ? 'Завантаження…' : 'Змінити фото'}
              </button>
              {avatarUrl && (
                <button className="btn btn-ghost btn-sm" onClick={handleRemoveAvatar} disabled={uploadingAvatar || removingAvatar}
                  style={{ color: 'var(--error)', fontSize: 12 }}>
                  {removingAvatar ? 'Видалення…' : 'Прибрати фото'}
                </button>
              )}
              <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>JPG, PNG до 5 МБ</p>
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
          </div>
        ))}

        {section('Основна інформація', (
          <>
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Ім'я</label>
              <input style={inp} value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Email</label>
              <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            {successMsg && <div style={{ padding: '8px 12px', borderRadius: 6, background: '#d1fae5', color: '#065f46', fontSize: 13, marginBottom: 12 }}>✓ {successMsg}</div>}
            {errorMsg  && <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fee2e2', color: '#991b1b', fontSize: 13, marginBottom: 12 }}>✗ {errorMsg}</div>}
            <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Зберегти'}
            </button>
          </>
        ))}

        {section('Зміна пароля', (
          <>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Поточний пароль</label>
              <input style={inp} type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} placeholder="••••••••" />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Новий пароль</label>
              <input style={inp} type="password" value={newPw} onChange={e => setNewPw(e.target.value)} placeholder="Мінімум 6 символів" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Підтвердження</label>
              <input style={inp} type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} placeholder="Повторіть новий пароль" />
            </div>
            {pwSuccess && <div style={{ padding: '8px 12px', borderRadius: 6, background: '#d1fae5', color: '#065f46', fontSize: 13, marginBottom: 12 }}>✓ {pwSuccess}</div>}
            {pwError   && <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fee2e2', color: '#991b1b', fontSize: 13, marginBottom: 12 }}>✗ {pwError}</div>}
            <button className="btn btn-primary" onClick={handleChangePassword} disabled={savingPw || !currentPw || !newPw || !confirmPw}>
              {savingPw ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> : 'Змінити пароль'}
            </button>
          </>
        ))}

        {section('Інформація про акаунт', (
          <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 2 }}>
            <div><strong>ID:</strong> {user?.id}</div>
            <div><strong>Зареєстровано:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
