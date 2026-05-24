import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import DefaultAvatar from '../components/DefaultAvatar';
import { useAuthStore } from '../store/authStore';
import api from '../api/client';

type AdminTab = 'users' | 'designs' | 'templates';

interface AdminUser {
  id: string; name: string; email: string; role: 'user' | 'admin';
  avatar?: string; isVerified: boolean; createdAt: string;
}
interface AdminDesign {
  id: string; title: string; width: number; height: number;
  isPublic: boolean; userId: string; thumbnail?: string;
  createdAt: string; updatedAt: string;
  user?: { id: string; name: string; email: string };
}
interface AdminTemplate {
  id: string; name: string; category: string; width: number; height: number;
  userId?: string; createdAt: string;
  user?: { id: string; name: string; email: string };
}

/* ── inline edit modal ─────────────────────────────────────── */
function EditUserModal({
  user, onSave, onClose,
}: { user: AdminUser; onSave: (id: string, data: any) => Promise<void>; onClose: () => void }) {
  const [name,  setName]  = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [role,  setRole]  = useState<'user' | 'admin'>(user.role);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const handleSave = async () => {
    setSaving(true); setErr('');
    try { await onSave(user.id, { name, email, role }); onClose(); }
    catch (e: any) { setErr(e?.response?.data?.message || 'Помилка збереження'); }
    finally { setSaving(false); }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: '1px solid var(--border)', fontSize: 14,
    background: 'var(--bg)', color: 'var(--text)', outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
      onClick={onClose}>
      <div className="card" style={{ width: 400, padding: 28 }} onClick={e => e.stopPropagation()}>
        <h3 style={{ marginBottom: 20, fontSize: 17, fontWeight: 700 }}>Редагувати користувача</h3>

        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Ім'я</label>
          <input style={inp} value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Email</label>
          <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 13, color: 'var(--text-muted)', display: 'block', marginBottom: 5 }}>Роль</label>
          <select style={{ ...inp }} value={role} onChange={e => setRole(e.target.value as 'user' | 'admin')}>
            <option value="user">Користувач</option>
            <option value="admin">Адміністратор</option>
          </select>
        </div>

        {err && <div style={{ padding: '8px 12px', borderRadius: 6, background: '#fee2e2', color: '#991b1b', fontSize: 13, marginBottom: 12 }}>✗ {err}</div>}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="btn btn-ghost" onClick={onClose} disabled={saving}>Скасувати</button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : 'Зберегти'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── main page ─────────────────────────────────────────────── */
export default function AdminPage() {
  const { user: me } = useAuthStore();
  const navigate = useNavigate();
  const [tab, setTab]           = useState<AdminTab>('users');
  const [users,     setUsers]     = useState<AdminUser[]>([]);
  const [designs,   setDesigns]   = useState<AdminDesign[]>([]);
  const [templates, setTemplates] = useState<AdminTemplate[]>([]);
  const [loading,   setLoading]   = useState(false);
  const [editUser,  setEditUser]  = useState<AdminUser | null>(null);
  const [search,    setSearch]    = useState('');

  useEffect(() => {
    if (me?.role !== 'admin') { navigate('/dashboard'); return; }
    loadTab(tab);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  const loadTab = async (t: AdminTab) => {
    setLoading(true); setSearch('');
    try {
      if (t === 'users')     setUsers((await api.get('/admin/users')).data);
      if (t === 'designs')   setDesigns((await api.get('/admin/designs')).data);
      if (t === 'templates') setTemplates((await api.get('/admin/templates')).data);
    } finally { setLoading(false); }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Видалити акаунт "${name}"? Всі дизайни та шаблони теж видаляться.`)) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const handleSaveUser = async (id: string, data: any) => {
    const { data: updated } = await api.patch(`/admin/users/${id}`, data);
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updated } : u));
  };

  const handleDeleteDesign = async (id: string, title: string) => {
    if (!confirm(`Видалити дизайн "${title}"?`)) return;
    await api.delete(`/admin/designs/${id}`);
    setDesigns(prev => prev.filter(d => d.id !== id));
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (!confirm(`Видалити шаблон "${name}"?`)) return;
    await api.delete(`/admin/templates/${id}`);
    setTemplates(prev => prev.filter(t => t.id !== id));
  };

  const fmt = (d: string) => new Date(d).toLocaleDateString('uk-UA', { day: 'numeric', month: 'short', year: 'numeric' });

  const tabBtn = (id: AdminTab, label: string, count?: number) => (
    <button key={id} onClick={() => setTab(id)} style={{
      padding: '8px 22px', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14,
      background: tab === id ? 'var(--primary)' : 'transparent',
      color: tab === id ? '#fff' : 'var(--text-muted)',
      transition: 'var(--transition)',
    }}>
      {label}{count !== undefined ? ` (${count})` : ''}
    </button>
  );

  /* filtered lists */
  const q = search.toLowerCase();
  const filteredUsers     = users.filter(u => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  const filteredDesigns   = designs.filter(d => d.title.toLowerCase().includes(q) || d.user?.name?.toLowerCase().includes(q) || false);
  const filteredTemplates = templates.filter(t => t.name.toLowerCase().includes(q) || t.user?.name?.toLowerCase().includes(q) || false);

  const thStyle: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid var(--border)', background: 'var(--surface)', whiteSpace: 'nowrap' };
  const tdStyle: React.CSSProperties = { padding: '11px 14px', fontSize: 13, borderBottom: '1px solid var(--border)', verticalAlign: 'middle' };

  return (
    <div className="page">
      <Navbar />
      <div className="container" style={{ padding: '32px 24px', flex: 1 }}>

        {/* header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 28 }}>
          <div style={{ width: 42, height: 42, borderRadius: 10, background: 'linear-gradient(135deg,#f59e0b,#ef4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>⚙</div>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 2 }}>Адміністративна панель</h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Управління користувачами, дизайнами та шаблонами</p>
          </div>
        </div>

        {/* stat cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Користувачів', count: users.length, color: '#6c63ff', icon: '👥' },
            { label: 'Дизайнів',     count: designs.length, color: '#10b981', icon: '🎨' },
            { label: 'Шаблонів',     count: templates.length, color: '#f59e0b', icon: '📋' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 700, color: s.color }}>{s.count}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* tabs + search */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4, background: 'var(--surface)', borderRadius: 10, padding: 4, border: '1px solid var(--border)' }}>
            {tabBtn('users',     'Користувачі', users.length)}
            {tabBtn('designs',   'Дизайни',     designs.length)}
            {tabBtn('templates', 'Шаблони',      templates.length)}
          </div>
          <input
            placeholder="Пошук…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 14, background: 'var(--bg)', color: 'var(--text)', outline: 'none', width: 220 }}
          />
        </div>

        {/* content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 60 }}>
            <span className="spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
          </div>
        ) : (
          <div className="card" style={{ overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>

              {/* ── Users table ── */}
              {tab === 'users' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Користувач</th>
                      <th style={thStyle}>Email</th>
                      <th style={thStyle}>Роль</th>
                      <th style={thStyle}>Верифіков.</th>
                      <th style={thStyle}>Дата реєстрації</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} style={{ transition: 'background 0.1s' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                        <td style={tdStyle}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            {u.avatar
                              ? <img src={u.avatar} alt="" style={{ width: 34, height: 34, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                              : <DefaultAvatar size={34} />}
                            <span style={{ fontWeight: 500 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: u.role === 'admin' ? '#fef3c7' : '#ede9ff',
                            color:      u.role === 'admin' ? '#92400e' : '#4c3d99',
                          }}>{u.role === 'admin' ? 'Адмін' : 'Юзер'}</span>
                        </td>
                        <td style={tdStyle}>
                          <span style={{ fontSize: 16 }}>{u.isVerified ? '✅' : '❌'}</span>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{fmt(u.createdAt)}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button onClick={() => setEditUser(u)}
                              style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                              Редагувати
                            </button>
                            {u.id !== me?.id && (
                              <button onClick={() => handleDeleteUser(u.id, u.name)}
                                style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #fca5a5', background: 'transparent', color: '#dc2626', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                                Видалити
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filteredUsers.length === 0 && (
                      <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Нічого не знайдено</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* ── Designs table ── */}
              {tab === 'designs' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Прев'ю</th>
                      <th style={thStyle}>Назва</th>
                      <th style={thStyle}>Власник</th>
                      <th style={thStyle}>Розмір</th>
                      <th style={thStyle}>Публічний</th>
                      <th style={thStyle}>Оновлено</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDesigns.map(d => (
                      <tr key={d.id}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                        <td style={tdStyle}>
                          {d.thumbnail
                            ? <img src={d.thumbnail} alt="" style={{ width: 56, height: 40, objectFit: 'cover', borderRadius: 6, border: '1px solid var(--border)' }} />
                            : <div style={{ width: 56, height: 40, borderRadius: 6, background: 'var(--surface)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>🎨</div>}
                        </td>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{d.title}</td>
                        <td style={tdStyle}>
                          <div style={{ fontSize: 12 }}>
                            <div style={{ fontWeight: 500 }}>{d.user?.name || '—'}</div>
                            <div style={{ color: 'var(--text-muted)' }}>{d.user?.email || ''}</div>
                          </div>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{d.width}×{d.height}</td>
                        <td style={tdStyle}><span style={{ fontSize: 16 }}>{d.isPublic ? '🌐' : '🔒'}</span></td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{fmt(d.updatedAt)}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <button onClick={() => handleDeleteDesign(d.id, d.title)}
                            style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #fca5a5', background: 'transparent', color: '#dc2626', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                            Видалити
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredDesigns.length === 0 && (
                      <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Нічого не знайдено</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {/* ── Templates table ── */}
              {tab === 'templates' && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={thStyle}>Назва</th>
                      <th style={thStyle}>Категорія</th>
                      <th style={thStyle}>Власник</th>
                      <th style={thStyle}>Розмір</th>
                      <th style={thStyle}>Тип</th>
                      <th style={thStyle}>Дата</th>
                      <th style={{ ...thStyle, textAlign: 'right' }}>Дії</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map(t => (
                      <tr key={t.id}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'var(--surface)'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = ''}>
                        <td style={{ ...tdStyle, fontWeight: 500 }}>{t.name}</td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{t.category}</td>
                        <td style={tdStyle}>
                          {t.user
                            ? <div style={{ fontSize: 12 }}><div style={{ fontWeight: 500 }}>{t.user.name}</div><div style={{ color: 'var(--text-muted)' }}>{t.user.email}</div></div>
                            : <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Системний</span>}
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{t.width}×{t.height}</td>
                        <td style={tdStyle}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                            background: t.userId ? '#d1fae5' : '#ede9ff',
                            color:      t.userId ? '#065f46' : '#4c3d99',
                          }}>{t.userId ? 'Користувач' : 'Системний'}</span>
                        </td>
                        <td style={{ ...tdStyle, color: 'var(--text-muted)' }}>{fmt(t.createdAt)}</td>
                        <td style={{ ...tdStyle, textAlign: 'right' }}>
                          <button onClick={() => handleDeleteTemplate(t.id, t.name)}
                            style={{ padding: '5px 14px', borderRadius: 6, border: '1px solid #fca5a5', background: 'transparent', color: '#dc2626', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>
                            Видалити
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredTemplates.length === 0 && (
                      <tr><td colSpan={7} style={{ ...tdStyle, textAlign: 'center', color: 'var(--text-muted)', padding: 40 }}>Нічого не знайдено</td></tr>
                    )}
                  </tbody>
                </table>
              )}

            </div>
          </div>
        )}
      </div>

      {editUser && (
        <EditUserModal user={editUser} onSave={handleSaveUser} onClose={() => setEditUser(null)} />
      )}
    </div>
  );
}
