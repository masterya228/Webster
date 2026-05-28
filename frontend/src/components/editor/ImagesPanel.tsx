import { useRef } from 'react';

interface Props {
  onAddImageUrl: (url: string) => void;
  onUploadFile: () => void;
  onClose: () => void;
}

const BG      = '#16162a';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const INPUT   = '#1e1e30';
const PRIMARY = '#6c63ff';

// Curated free stock images from Unsplash (static, no API key needed)
const STOCK = [
  { id: 'n1', label: 'Природа',    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70' },
  { id: 'n2', label: 'Місто',      url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70' },
  { id: 'n3', label: 'Абстракція', url: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&q=70' },
  { id: 'n4', label: 'Технології', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=70' },
  { id: 'n5', label: 'Природа 2',  url: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=70' },
  { id: 'n6', label: 'Архітект.',  url: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=70' },
  { id: 'n7', label: 'Гори',       url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70' },
  { id: 'n8', label: 'Океан',      url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400&q=70' },
  { id: 'n9', label: 'Ліс',        url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=70' },
  { id:'n10', label: 'Квіти',      url: 'https://images.unsplash.com/photo-1490750967868-88df5691cc07?w=400&q=70' },
  { id:'n11', label: 'Текстура',   url: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=400&q=70' },
  { id:'n12', label: 'Захід',      url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400&q=70' },
];

export default function ImagesPanel({ onAddImageUrl, onUploadFile, onClose }: Props) {
  return (
    <div style={{
      width: 220, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Зображення</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
      </div>

      <div style={{ padding: '10px 10px 6px' }}>
        <button
          onClick={onUploadFile}
          style={{
            width: '100%', padding: '8px 0', borderRadius: 8, border: `1px dashed ${PRIMARY}`,
            background: 'transparent', color: PRIMARY, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Завантажити своє
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 12px' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.06em', padding: '6px 2px 8px' }}>
          Стокові фото
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {STOCK.map(img => (
            <button
              key={img.id}
              onClick={() => onAddImageUrl(img.url)}
              title={img.label}
              style={{
                padding: 0, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden',
                cursor: 'pointer', background: INPUT, transition: 'border-color .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = PRIMARY}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BORDER}
            >
              <img
                src={img.url}
                alt={img.label}
                style={{ width: '100%', height: 70, objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
              <div style={{ fontSize: 9, color: MUTED, padding: '3px 4px', textAlign: 'center' }}>{img.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
