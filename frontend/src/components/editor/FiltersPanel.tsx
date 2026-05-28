interface FilterDef {
  id: string;
  label: string;
  preview: string;    // CSS filter for the preview swatch
  fabricFilter: any;  // fabric.js filter object spec
}

interface Props {
  onApplyFilter: (filter: FilterDef) => void;
  onClose: () => void;
}

const BG      = '#16162a';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const PRIMARY = '#6c63ff';

export const FILTERS: FilterDef[] = [
  { id: 'grayscale',   label: 'Ч/Б',        preview: 'grayscale(1)',                        fabricFilter: { type: 'Grayscale' } },
  { id: 'sepia',       label: 'Сепія',       preview: 'sepia(0.8)',                          fabricFilter: { type: 'Sepia', value: 0.8 } },
  { id: 'invert',      label: 'Інвертація',  preview: 'invert(1)',                           fabricFilter: { type: 'Invert' } },
  { id: 'blur',        label: 'Розмиття',    preview: 'blur(3px)',                           fabricFilter: { type: 'Blur', blur: 0.1 } },
  { id: 'sharpen',     label: 'Різкість',    preview: 'contrast(1.4) brightness(1.05)',      fabricFilter: { type: 'Convolute', matrix: [0,-1,0,-1,5,-1,0,-1,0] } },
  { id: 'vintage',     label: 'Вінтаж',      preview: 'sepia(0.5) contrast(0.9) brightness(0.9) saturate(1.2)', fabricFilter: { type: 'Vintage' } },
  { id: 'warm',        label: 'Тепло',       preview: 'sepia(0.25) brightness(1.1)',         fabricFilter: { type: 'ColorMatrix', matrix: [1.2,0.05,0,0,0, 0,1.05,0,0,0, 0,0,0.85,0,0, 0,0,0,1,0] } },
  { id: 'cool',        label: 'Холод',       preview: 'hue-rotate(180deg) saturate(1.2)',    fabricFilter: { type: 'ColorMatrix', matrix: [0.85,0,0.1,0,0, 0,0.95,0.1,0,0, 0.05,0.1,1.2,0,0, 0,0,0,1,0] } },
  { id: 'brightness',  label: 'Яскраво',     preview: 'brightness(1.35)',                   fabricFilter: { type: 'Brightness', brightness: 0.35 } },
  { id: 'contrast',    label: 'Контраст',    preview: 'contrast(1.5)',                       fabricFilter: { type: 'Contrast', contrast: 0.3 } },
  { id: 'saturate',    label: 'Насиченість', preview: 'saturate(2)',                         fabricFilter: { type: 'Saturation', saturation: 0.8 } },
  { id: 'technicolor', label: 'Технікол.',   preview: 'hue-rotate(30deg) saturate(1.8) contrast(1.2)', fabricFilter: { type: 'Technicolor' } },
];

// A small preview swatch using a gradient to show the filter effect
const SWATCH_GRADIENT = 'linear-gradient(135deg, #f59e0b, #6c63ff, #10b981)';

export default function FiltersPanel({ onApplyFilter, onClose }: Props) {
  return (
    <div style={{
      width: 220, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Фільтри</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
      </div>

      <div style={{ padding: '8px 10px 4px' }}>
        <div style={{ fontSize: 10, color: MUTED, lineHeight: 1.5 }}>
          Виберіть об'єкт на полотні, потім натисніть фільтр щоб застосувати.
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px 10px 12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => onApplyFilter(f)}
              title={`Застосувати: ${f.label}`}
              style={{
                padding: 0, border: `1px solid ${BORDER}`, borderRadius: 7, overflow: 'hidden',
                cursor: 'pointer', background: 'transparent', transition: 'border-color .15s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = PRIMARY}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BORDER}
            >
              {/* Swatch showing the filter effect */}
              <div style={{
                width: '100%', height: 52,
                background: SWATCH_GRADIENT,
                filter: f.preview,
              }} />
              <div style={{ fontSize: 10, color: MUTED, padding: '3px 4px', textAlign: 'center', background: '#1a1a2e' }}>
                {f.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
