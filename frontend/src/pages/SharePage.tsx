import { useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import { fabric } from 'fabric';
import { Design } from '../types';
import api from '../api/client';
import { resolveCanvasJsonUrls } from '../utils/urls';

const SOCIAL_SHARE = [
  { label: 'Facebook',  color: '#1877f2', href: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}` },
  { label: 'Twitter',   color: '#000',    href: (u: string, t: string) => `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { label: 'Telegram',  color: '#0088cc', href: (u: string, t: string) => `https://t.me/share/url?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}` },
  { label: 'WhatsApp',  color: '#25d366', href: (u: string, t: string) => `https://wa.me/?text=${encodeURIComponent(t + ' ' + u)}` },
  { label: 'LinkedIn',  color: '#0a66c2', href: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}` },
];

export default function SharePage() {
  const { id } = useParams<{ id: string }>();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);

  const [design, setDesign]   = useState<Design | null>(null);
  const [error,  setError]    = useState('');
  const [loading, setLoading] = useState(true);
  const [copied,  setCopied]  = useState(false);

  const shareUrl = window.location.href;

  useEffect(() => {
    api.get(`/designs/share/${id}`)
      .then(({ data }) => setDesign(data))
      .catch(() => setError('Дизайн не знайдено або він не є публічним'))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!design || !canvasRef.current) return;

    const canvasData = design.canvasData as any;
    const w = design.width;
    const h = design.height;

    const maxW = Math.min(window.innerWidth - 48, 560);
    const maxH = Math.min(Math.round(window.innerHeight * 0.55), 480);
    const scale = Math.min(maxW / w, maxH / h, 1);
    const dispW = Math.round(w * scale);
    const dispH = Math.round(h * scale);

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: w,
      height: h,
      backgroundColor: canvasData?.background || '#fff',
      selection: false,
      interactive: false,
    });
    fabricRef.current = canvas;

    canvas.loadFromJSON(resolveCanvasJsonUrls(canvasData), () => {
      canvas.getObjects().forEach(o => { o.selectable = false; o.evented = false; o.hoverCursor = 'default'; });
      // Apply scale after load so viewport is not reset
      canvas.setDimensions({ width: dispW, height: dispH });
      canvas.setViewportTransform([scale, 0, 0, scale, 0, 0]);
      canvas.renderAll();
    });

    return () => { canvas.dispose(); fabricRef.current = null; };
  }, [design]);

  const copyLink = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const openShare = (href: string) =>
    window.open(href, '_blank', 'width=640,height=480,noopener,noreferrer');

  if (loading) return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <span className="spinner" style={{ width: 48, height: 48, borderWidth: 4 }} />
    </div>
  );

  if (error) return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)', gap: 16 }}>
      <div style={{ fontSize: 64 }}>🔒</div>
      <h2 style={{ fontSize: 22 }}>{error}</h2>
      <Link to="/" className="btn btn-primary">На головну</Link>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        background: 'var(--surface)', borderBottom: '1px solid var(--border)',
        padding: '0 24px', height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo size={30} textSize={19} />
        </Link>
        <Link to="/register" className="btn btn-primary btn-sm">Створити безкоштовно</Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 24px', gap: 24 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6 }}>{design?.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{design?.width} × {design?.height} px</p>
        </div>

        <div style={{ boxShadow: '0 8px 48px rgba(0,0,0,.18)', borderRadius: 4, overflow: 'hidden', display: 'inline-block', maxWidth: '100%' }}>
          <canvas ref={canvasRef} />
        </div>

        <div style={{ width: '100%', maxWidth: 480, background: 'var(--surface)', borderRadius: 16, padding: 24, border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 14 }}>Поширити</h3>

          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input readOnly value={shareUrl}
              style={{ flex: 1, padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)', color: 'var(--text)', outline: 'none' }}
              onClick={e => (e.target as HTMLInputElement).select()} />
            <button onClick={copyLink} className="btn btn-primary btn-sm" style={{ flexShrink: 0 }}>
              {copied ? '✓' : 'Копіювати'}
            </button>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {SOCIAL_SHARE.map(s => (
              <button key={s.label}
                onClick={() => openShare(s.href(shareUrl, design?.title || ''))}
                style={{
                  padding: '8px 14px', borderRadius: 8, border: `1.5px solid ${s.color}`,
                  background: 'transparent', color: s.color, fontSize: 13, fontWeight: 600,
                  cursor: 'pointer', transition: 'background .15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = s.color + '20'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', padding: '16px 0 32px' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: 12 }}>Хочете створити щось подібне?</p>
          <Link to="/register" className="btn btn-primary btn-lg">Спробувати Vizora безкоштовно</Link>
        </div>
      </div>
    </div>
  );
}
