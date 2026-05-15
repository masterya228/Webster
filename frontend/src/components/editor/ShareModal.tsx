import { useState } from 'react';

interface Props {
  designId: string;
  title: string;
  thumbnail?: string;
  isPublic: boolean;
  onTogglePublic: (pub: boolean) => Promise<void>;
  onClose: () => void;
}

const SOCIAL = [
  {
    id: 'facebook',
    label: 'Facebook',
    color: '#1877f2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
    href: (url: string, title: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: 'twitter',
    label: 'Twitter / X',
    color: '#000000',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
    href: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'telegram',
    label: 'Telegram',
    color: '#0088cc',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    href: (url: string, title: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    color: '#25d366',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
      </svg>
    ),
    href: (url: string, title: string) =>
      `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    color: '#0a66c2',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    href: (url: string, title: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  },
  {
    id: 'reddit',
    label: 'Reddit',
    color: '#ff4500',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
      </svg>
    ),
    href: (url: string, title: string) =>
      `https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
  },
];

export default function ShareModal({ designId, title, thumbnail, isPublic, onTogglePublic, onClose }: Props) {
  const [pub, setPub]       = useState(isPublic);
  const [toggling, setToggling] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/share/${designId}`;

  const handleToggle = async () => {
    setToggling(true);
    try {
      await onTogglePublic(!pub);
      setPub(v => !v);
    } finally {
      setToggling(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openShare = (href: string) => {
    window.open(href, '_blank', 'width=640,height=480,noopener,noreferrer');
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 2000, padding: 24,
    }} onClick={onClose}>
      <div style={{
        background: 'var(--surface)', borderRadius: 16, padding: 32,
        width: '100%', maxWidth: 480, boxShadow: '0 24px 80px rgba(0,0,0,.35)',
      }} onClick={e => e.stopPropagation()}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>Поширити дизайн</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', color: 'var(--text-muted)', lineHeight: 1 }}>×</button>
        </div>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24, alignItems: 'center' }}>
          <div style={{
            width: 72, height: 56, borderRadius: 8, overflow: 'hidden', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--primary-light), #fde7f0)',
            border: '1px solid var(--border)',
          }}>
            {thumbnail && <img src={thumbnail} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{title}</div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12,
              padding: '3px 10px', borderRadius: 20,
              background: pub ? '#d1fae5' : '#fee2e2',
              color: pub ? '#065f46' : '#991b1b',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: pub ? '#10b981' : '#ef4444', flexShrink: 0 }} />
              {pub ? 'Публічний' : 'Приватний'}
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', borderRadius: 10, border: '1px solid var(--border)',
          background: 'var(--bg)', marginBottom: 20,
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Публічний доступ</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {pub ? 'Будь-хто з посиланням може переглянути' : 'Тільки ви можете бачити цей дизайн'}
            </div>
          </div>
          <button onClick={handleToggle} disabled={toggling} style={{
            width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer',
            background: pub ? 'var(--primary)' : '#d1d5db',
            position: 'relative', transition: 'background .2s', flexShrink: 0,
          }}>
            <span style={{
              position: 'absolute', top: 3, left: pub ? 25 : 3,
              width: 20, height: 20, borderRadius: '50%', background: '#fff',
              transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,.2)',
            }} />
          </button>
        </div>

        {pub && (
          <>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 6 }}>Посилання для поширення</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <input readOnly value={shareUrl} style={{
                  flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)',
                  fontSize: 13, background: 'var(--bg)', color: 'var(--text)', outline: 'none',
                }} onClick={e => (e.target as HTMLInputElement).select()} />
                <button onClick={copyLink} className="btn btn-primary btn-sm" style={{ flexShrink: 0, minWidth: 80 }}>
                  {copied ? '✓ Скопійовано' : 'Копіювати'}
                </button>
              </div>
            </div>

            <div>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', display: 'block', marginBottom: 10 }}>Поширити в соціальних мережах</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                {SOCIAL.map(s => (
                  <button key={s.id} onClick={() => openShare(s.href(shareUrl, title))}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 12px', borderRadius: 8, border: '1px solid var(--border)',
                      background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer',
                      fontSize: 12, fontWeight: 500, transition: 'background .15s, border-color .15s',
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.background = s.color + '18';
                      (e.currentTarget as HTMLElement).style.borderColor = s.color;
                      (e.currentTarget as HTMLElement).style.color = s.color;
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.background = 'var(--bg)';
                      (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
                      (e.currentTarget as HTMLElement).style.color = 'var(--text)';
                    }}
                  >
                    <span style={{ color: s.color, flexShrink: 0 }}>{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {!pub && (
          <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '12px 0' }}>
            Увімкніть публічний доступ, щоб отримати посилання для поширення
          </p>
        )}
      </div>
    </div>
  );
}
