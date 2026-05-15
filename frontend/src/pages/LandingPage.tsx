import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { LogoMark } from '../components/Logo';
import { useAuthStore } from '../store/authStore';

const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6c63ff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r="3.5"/><path d="M5 21l4-8 3 4 3-3 4 6H5z"/>
      </svg>
    ),
    color: '#ede9ff', title: 'Потужне полотно',
    desc: 'Перетягуйте фігури, зображення і текст на професійному полотні з Fabric.js.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
      </svg>
    ),
    color: '#f5f0ff', title: 'Розумні шаблони',
    desc: 'Готові шаблони для Instagram, Facebook, YouTube та багато іншого.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
    color: '#fdf2f8', title: 'Редагування зображень',
    desc: 'Фільтри, яскравість, контраст і красиві ефекти для вашого контенту.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
      </svg>
    ),
    color: '#fffbeb', title: 'Типографіка',
    desc: 'Десятки шрифтів із повним контролем розміру, кольору та відступів.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
    ),
    color: '#f0fdf4', title: 'Легкий експорт',
    desc: 'Завантажте дизайн як PNG, JPEG, SVG або PDF одним кліком.',
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    color: '#eff6ff', title: 'Хмарне збереження',
    desc: 'Усі ваші дизайни автоматично зберігаються в хмарі.',
  },
];

const formats = [
  { label: 'Instagram Post',    size: '1080×1080', color: '#f5f0ff' },
  { label: 'Instagram Story',   size: '1080×1920', color: '#fdf2f8' },
  { label: 'Facebook Cover',    size: '851×315',   color: '#eff6ff' },
  { label: 'Twitter Banner',    size: '1500×500',  color: '#f0fdf4' },
  { label: 'YouTube Thumbnail', size: '1280×720',  color: '#fffbeb' },
  { label: 'Business Card',     size: '1050×600',  color: '#fef2f2' },
  { label: 'A4 Poster',         size: '794×1123',  color: '#f5f0ff' },
  { label: 'Презентація',       size: '1280×720',  color: '#f0fdf4' },
];

export default function LandingPage() {
  const { user } = useAuthStore();
  return (
    <div className="page">
      <Navbar />

      <section style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d6e 60%, #6c63ff 100%)', padding: '110px 24px 120px', textAlign: 'center', color: '#fff' }}>
        <svg style={{ position: 'absolute', top: -60, left: -80, opacity: 0.18 }} width="420" height="420" viewBox="0 0 420 420">
          <circle cx="210" cy="210" r="210" fill="#a855f7"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: -100, right: -60, opacity: 0.14 }} width="380" height="380" viewBox="0 0 380 380">
          <circle cx="190" cy="190" r="190" fill="#6c63ff"/>
        </svg>
        <svg style={{ position: 'absolute', top: 40, right: '18%', opacity: 0.22 }} width="180" height="180" viewBox="0 0 180 180">
          <polygon points="90,10 170,170 10,170" fill="#ff6584"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: 30, left: '14%', opacity: 0.15 }} width="120" height="120" viewBox="0 0 120 120">
          <rect x="10" y="10" width="100" height="100" rx="20" fill="#fcb045"/>
        </svg>
        <svg style={{ position: 'absolute', top: '30%', left: '8%', opacity: 0.12 }} width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="40" fill="#fff"/>
        </svg>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>

          <h1 style={{ fontSize: 'clamp(34px, 5.5vw, 66px)', fontFamily: 'Playfair Display, serif', marginBottom: 22, lineHeight: 1.1, letterSpacing: '-0.5px' }}>
            Створюйте красиві візуали<br />
            <span style={{ color: '#c4b5fd' }}>без навичок дизайну</span>
          </h1>
          <p style={{ fontSize: 18, opacity: 0.85, maxWidth: 540, margin: '0 auto 44px', lineHeight: 1.75 }}>
            Vizora — ваш онлайн редактор графіки. Дизайн для соціальних мереж, банери, постери та більше — за хвилини.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to="/dashboard" className="btn btn-lg" style={{ background: '#fff', color: '#6c63ff', fontWeight: 700, boxShadow: '0 8px 32px rgba(108,99,255,0.35)' }}>
                Мій Dashboard
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-lg" style={{ background: '#fff', color: '#6c63ff', fontWeight: 700, boxShadow: '0 8px 32px rgba(108,99,255,0.35)' }}>
                  Почати безкоштовно
                </Link>
                <Link to="/login" className="btn btn-lg" style={{ border: '1.5px solid rgba(255,255,255,0.45)', color: '#fff', background: 'transparent' }}>
                  Увійти
                </Link>
              </>
            )}
          </div>

          <div style={{ marginTop: 64, display: 'flex', justifyContent: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, padding: 12, backdropFilter: 'blur(8px)', maxWidth: 560, width: '100%' }}>
              <svg viewBox="0 0 540 300" style={{ width: '100%', borderRadius: 8, display: 'block' }}>
                <rect width="540" height="300" fill="#fff" rx="6"/>
                <rect x="0" y="0" width="160" height="300" fill="#6c63ff"/>
                <circle cx="80" cy="100" r="50" fill="rgba(255,255,255,0.15)"/>
                <rect x="20" y="180" width="120" height="8" rx="4" fill="rgba(255,255,255,0.5)"/>
                <rect x="30" y="200" width="100" height="6" rx="3" fill="rgba(255,255,255,0.3)"/>
                <rect x="190" y="40" width="240" height="18" rx="4" fill="#1a1a2e"/>
                <rect x="190" y="70" width="180" height="10" rx="3" fill="#e2e0f0"/>
                <rect x="190" y="88" width="200" height="10" rx="3" fill="#e2e0f0"/>
                <rect x="190" y="120" width="100" height="34" rx="8" fill="#6c63ff"/>
                <rect x="190" y="170" width="230" height="1" fill="#e2e0f0"/>
                <rect x="190" y="190" width="60" height="60" rx="6" fill="#f5f0ff"/>
                <rect x="262" y="190" width="60" height="60" rx="6" fill="#fdf2f8"/>
                <rect x="334" y="190" width="60" height="60" rx="6" fill="#f0fdf4"/>
                <circle cx="220" cy="220" r="14" fill="#a855f7" opacity=".6"/>
                <circle cx="292" cy="220" r="14" fill="#ec4899" opacity=".6"/>
                <circle cx="364" cy="220" r="14" fill="#22c55e" opacity=".6"/>
                <rect x="188" y="118" width="104" height="38" rx="9" fill="none" stroke="#6c63ff" strokeWidth="1.5" strokeDasharray="3 2"/>
                <circle cx="188" cy="118" r="3" fill="#6c63ff"/>
                <circle cx="292" cy="118" r="3" fill="#6c63ff"/>
                <circle cx="188" cy="156" r="3" fill="#6c63ff"/>
                <circle cx="292" cy="156" r="3" fill="#6c63ff"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      <section style={{ padding: '88px 24px', background: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div style={{ display: 'inline-block', background: 'var(--primary-light)', color: 'var(--primary)', borderRadius: 99, padding: '4px 16px', fontSize: 12, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Можливості
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>Все що вам потрібно</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Інструменти студійного рівня, прості для кожного</p>
          </div>
          <div className="grid-3">
            {features.map((f) => (
              <div key={f.title} className="card fade-in" style={{ padding: '28px 28px 24px', borderTop: '3px solid transparent', background: 'var(--surface)', transition: 'transform .2s, box-shadow .2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(108,99,255,0.14)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = ''; }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  {f.icon}
                </div>
                <h3 style={{ marginBottom: 8, fontSize: 17, fontWeight: 600 }}>{f.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.75 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '72px 24px', background: 'var(--surface)', position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', top: -80, right: -80, opacity: 0.05 }} width="400" height="400" viewBox="0 0 400 400">
          <circle cx="200" cy="200" r="200" fill="#6c63ff"/>
        </svg>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#fdf2f8', color: '#ec4899', borderRadius: 99, padding: '4px 16px', fontSize: 12, fontWeight: 600, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              Формати
            </div>
            <h2 style={{ fontSize: 'clamp(26px, 3.5vw, 36px)', fontFamily: 'Playfair Display, serif', marginBottom: 12 }}>Для будь-якої платформи</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Готові розміри для всіх основних платформ</p>
          </div>
          <div className="grid-4">
            {formats.map((f) => (
              <Link key={f.label} to={user ? '/dashboard' : '/register'} style={{
                background: f.color, border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', padding: '20px 16px',
                textAlign: 'center', display: 'block', textDecoration: 'none',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.transform = ''; }}
              >
                <div style={{ fontWeight: 600, marginBottom: 5, fontSize: 14 }}>{f.label}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', fontVariantNumeric: 'tabular-nums' }}>{f.size}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '88px 24px', textAlign: 'center', background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2d6e 100%)', position: 'relative', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', top: -60, left: -40, opacity: 0.12 }} width="300" height="300" viewBox="0 0 300 300">
          <polygon points="150,10 290,280 10,280" fill="#6c63ff"/>
        </svg>
        <svg style={{ position: 'absolute', bottom: -40, right: -40, opacity: 0.1 }} width="260" height="260" viewBox="0 0 260 260">
          <circle cx="130" cy="130" r="130" fill="#a855f7"/>
        </svg>
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', marginBottom: 16, fontFamily: 'Playfair Display, serif', color: '#fff' }}>
            Готові створити свій шедевр?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 36, fontSize: 16, maxWidth: 480, margin: '0 auto 36px' }}>
            Приєднуйтесь до тисяч творців, які щодня використовують Vizora.
          </p>
          {user ? (
            <Link to="/dashboard" className="btn btn-lg" style={{ background: '#6c63ff', color: '#fff', boxShadow: '0 8px 32px rgba(108,99,255,0.4)', fontWeight: 700 }}>
              Перейти до Dashboard
            </Link>
          ) : (
            <Link to="/register" className="btn btn-lg" style={{ background: '#6c63ff', color: '#fff', boxShadow: '0 8px 32px rgba(108,99,255,0.4)', fontWeight: 700 }}>
              Почати безкоштовно — без картки
            </Link>
          )}
        </div>
      </section>

      <footer style={{ background: '#0f0f1a', color: '#666', padding: '32px 24px', textAlign: 'center', fontSize: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
          <LogoMark size={24} />
          <span style={{ fontSize: 18, fontWeight: 700, color: '#aaa', letterSpacing: '-0.2px' }}>Vizora</span>
        </div>
        <p>© {new Date().getFullYear()} Vizora. Онлайн редактор графіки для всіх.</p>
      </footer>
    </div>
  );
}
