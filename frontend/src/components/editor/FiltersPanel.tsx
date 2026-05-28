export interface FilterDef {
  id: string;
  label: string;
  preview: string;   // CSS filter string — used for swatch preview AND canvas/object rendering
}

interface Props {
  onApply: (filter: FilterDef) => void;
  onClear: () => void;
  onClose: () => void;
  hasSelection: boolean;  // are objects currently selected on canvas?
}

const BG      = '#16162a';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const PRIMARY = '#6c63ff';

export const FILTERS: FilterDef[] = [
  { id: 'grayscale',   label: 'Ч/Б',        preview: 'grayscale(1)' },
  { id: 'sepia',       label: 'Сепія',       preview: 'sepia(0.85)' },
  { id: 'invert',      label: 'Інвертація',  preview: 'invert(1)' },
  { id: 'blur',        label: 'Розмиття',    preview: 'blur(4px)' },
  { id: 'sharpen',     label: 'Різкість',    preview: 'contrast(1.4) brightness(1.05)' },
  { id: 'vintage',     label: 'Вінтаж',      preview: 'sepia(0.5) contrast(0.9) brightness(0.9) saturate(1.2)' },
  { id: 'warm',        label: 'Тепло',       preview: 'sepia(0.25) brightness(1.1) saturate(1.3)' },
  { id: 'cool',        label: 'Холод',       preview: 'hue-rotate(200deg) saturate(1.1) brightness(1.05)' },
  { id: 'bright',      label: 'Яскраво',     preview: 'brightness(1.4)' },
  { id: 'contrast',    label: 'Контраст',    preview: 'contrast(1.6)' },
  { id: 'saturate',    label: 'Насиченість', preview: 'saturate(2.5)' },
  { id: 'fade',        label: 'Вицвілий',    preview: 'saturate(0.4) brightness(1.1)' },
];

const SWATCH = 'linear-gradient(135deg, #f59e0b 0%, #6c63ff 50%, #10b981 100%)';

export default function FiltersPanel({ onApply, onClear, onClose, hasSelection }: Props) {
  const hint = hasSelection
    ? "Фільтр застосується до виділених об'єктів"
    : 'Нічого не виділено — фільтр накладеться на все полотно';

  return (
    <div style={{
      width: 218, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Фільтри</span>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
      </div>

      {/* Context hint */}
      <div style={{ padding: '8px 11px 6px', borderBottom: `1px solid ${BORDER}` }}>
        <div style={{
          fontSize: 10, color: hasSelection ? '#7dd3fc' : MUTED, lineHeight: 1.5,
          background: hasSelection ? 'rgba(125,211,252,.08)' : 'transparent',
          borderRadius: 6, padding: '4px 7px',
        }}>
          {hint}
        </div>
      </div>

      {/* Filter grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => onApply(f)}
              title={f.label}
              style={{
                padding: 0, border: `1px solid ${BORDER}`, borderRadius: 7, overflow: 'hidden',
                cursor: 'pointer', background: 'transparent', transition: 'border-color .13s, transform .1s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.borderColor = PRIMARY;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.borderColor = BORDER;
                (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
              }}
            >
              <div style={{ width: '100%', height: 44, background: SWATCH, filter: f.preview }} />
              <div style={{ fontSize: 9.5, color: MUTED, padding: '3px 4px', textAlign: 'center', background: '#1a1a2e' }}>
                {f.label}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Clear button */}
      <div style={{ padding: '8px 10px 10px', borderTop: `1px solid ${BORDER}` }}>
        <button
          onClick={onClear}
          style={{
            width: '100%', padding: '7px 0', borderRadius: 8, border: `1px solid ${BORDER}`,
            background: 'transparent', color: MUTED, fontSize: 11, fontWeight: 500, cursor: 'pointer',
            transition: 'border-color .13s, color .13s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ef4444'; (e.currentTarget as HTMLElement).style.color = '#ef4444'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = BORDER; (e.currentTarget as HTMLElement).style.color = MUTED; }}
        >
          × Зняти фільтр
        </button>
      </div>
    </div>
  );
}
