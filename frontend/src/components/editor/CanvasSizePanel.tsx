import { useState } from 'react';

interface Props {
  currentW: number;
  currentH: number;
  onApply: (w: number, h: number) => void;
  onClose: () => void;
}

const BG     = '#16162a';
const BORDER = '#2d2d45';
const TEXT   = '#d0d0e8';
const MUTED  = '#6b6b90';
const INPUT  = '#1e1e30';
const PRIMARY = '#6c63ff';

const PRESETS = [
  { label: 'HD 1920×1080',    w: 1920, h: 1080 },
  { label: 'A4  794×1123',    w: 794,  h: 1123 },
  { label: '800×600',         w: 800,  h: 600  },
  { label: 'Square 800×800',  w: 800,  h: 800  },
  { label: 'Story 1080×1920', w: 1080, h: 1920 },
  { label: '4K 3840×2160',    w: 3840, h: 2160 },
];

const numStyle = {
  width: '100%', padding: '7px 10px', borderRadius: 8,
  border: `1px solid ${BORDER}`, fontSize: 13,
  background: INPUT, color: TEXT, outline: 'none', boxSizing: 'border-box' as const,
};

export default function CanvasSizePanel({ currentW, currentH, onApply, onClose }: Props) {
  const [w, setW] = useState(currentW);
  const [h, setH] = useState(currentH);

  return (
    <div style={{
      width: 220, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Розмір полотна</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '10px 12px 16px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.06em' }}>Поточний: {currentW}×{currentH}</div>

        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Ширина (px)</div>
            <input type="number" min={1} max={10000} value={w}
              onChange={e => setW(Math.max(1, Math.min(10000, Number(e.target.value))))}
              style={numStyle} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, color: MUTED, marginBottom: 4 }}>Висота (px)</div>
            <input type="number" min={1} max={10000} value={h}
              onChange={e => setH(Math.max(1, Math.min(10000, Number(e.target.value))))}
              style={numStyle} />
          </div>
        </div>

        <button
          onClick={() => onApply(w, h)}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8, border: 'none',
            background: PRIMARY, color: '#fff', fontWeight: 600, fontSize: 13, cursor: 'pointer',
          }}>
          Застосувати {w}×{h}
        </button>

        <div style={{ height: 1, background: BORDER }} />
        <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.06em' }}>Готові розміри</div>

        {PRESETS.map(p => (
          <button key={p.label} onClick={() => { setW(p.w); setH(p.h); }}
            style={{
              width: '100%', padding: '7px 10px', borderRadius: 7, border: `1px solid ${BORDER}`,
              background: w === p.w && h === p.h ? PRIMARY : 'transparent',
              color: w === p.w && h === p.h ? '#fff' : MUTED,
              fontSize: 11, cursor: 'pointer', textAlign: 'left', transition: 'background .15s',
            }}>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}
