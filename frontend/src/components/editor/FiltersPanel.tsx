export interface FilterDef {
  id: string;
  label: string;
  preview: string;    // CSS filter string for preview swatch & canvas overlay
  fabricFilter: any;  // fabric.js filter spec for image objects
}

interface Props {
  onApplyFilter: (filter: FilterDef) => void;
  onApplyCanvasFilter: (cssFilter: string) => void;
  onClearCanvasFilter: () => void;
  canvasFilter: string;   // current active canvas CSS filter (empty = none)
  onClose: () => void;
}

const BG      = '#16162a';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const PRIMARY = '#6c63ff';

export const FILTERS: FilterDef[] = [
  { id: 'grayscale',   label: 'Ч/Б',        preview: 'grayscale(1)',                                      fabricFilter: { type: 'Grayscale' } },
  { id: 'sepia',       label: 'Сепія',       preview: 'sepia(0.8)',                                        fabricFilter: { type: 'Sepia', value: 0.8 } },
  { id: 'invert',      label: 'Інвертація',  preview: 'invert(1)',                                         fabricFilter: { type: 'Invert' } },
  { id: 'blur',        label: 'Розмиття',    preview: 'blur(3px)',                                         fabricFilter: { type: 'Blur', blur: 0.1 } },
  { id: 'sharpen',     label: 'Різкість',    preview: 'contrast(1.4) brightness(1.05)',                    fabricFilter: { type: 'Convolute', matrix: [0,-1,0,-1,5,-1,0,-1,0] } },
  { id: 'vintage',     label: 'Вінтаж',      preview: 'sepia(0.5) contrast(0.9) brightness(0.9) saturate(1.2)', fabricFilter: { type: 'Vintage' } },
  { id: 'warm',        label: 'Тепло',       preview: 'sepia(0.25) brightness(1.1)',                      fabricFilter: { type: 'ColorMatrix', matrix: [1.2,0.05,0,0,0, 0,1.05,0,0,0, 0,0,0.85,0,0, 0,0,0,1,0] } },
  { id: 'cool',        label: 'Холод',       preview: 'hue-rotate(200deg) saturate(1.2)',                 fabricFilter: { type: 'ColorMatrix', matrix: [0.85,0,0.1,0,0, 0,0.95,0.1,0,0, 0.05,0.1,1.2,0,0, 0,0,0,1,0] } },
  { id: 'brightness',  label: 'Яскраво',     preview: 'brightness(1.35)',                                 fabricFilter: { type: 'Brightness', brightness: 0.35 } },
  { id: 'contrast',    label: 'Контраст',    preview: 'contrast(1.5)',                                    fabricFilter: { type: 'Contrast', contrast: 0.3 } },
  { id: 'saturate',    label: 'Насиченість', preview: 'saturate(2)',                                      fabricFilter: { type: 'Saturation', saturation: 0.8 } },
  { id: 'technicolor', label: 'Технікол.',   preview: 'hue-rotate(30deg) saturate(1.8) contrast(1.2)',   fabricFilter: { type: 'Technicolor' } },
];

const SWATCH_GRADIENT = 'linear-gradient(135deg, #f59e0b 0%, #6c63ff 50%, #10b981 100%)';

export default function FiltersPanel({ onApplyFilter, onApplyCanvasFilter, onClearCanvasFilter, canvasFilter, onClose }: Props) {
  return (
    <div style={{
      width: 224, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: TEXT }}>Фільтри</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: MUTED, cursor: 'pointer', fontSize: 18, lineHeight: 1, padding: '0 2px' }}>×</button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {/* Canvas-wide filter section */}
        <div style={{ padding: '10px 10px 8px', borderBottom: `1px solid ${BORDER}` }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 8 }}>
            На все полотно
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 8 }}>
            {FILTERS.map(f => {
              const active = canvasFilter === f.preview;
              return (
                <button
                  key={'cv-' + f.id}
                  onClick={() => active ? onClearCanvasFilter() : onApplyCanvasFilter(f.preview)}
                  title={active ? 'Скинути' : `Полотно: ${f.label}`}
                  style={{
                    padding: 0, border: `1.5px solid ${active ? PRIMARY : BORDER}`, borderRadius: 6,
                    overflow: 'hidden', cursor: 'pointer', background: 'transparent', transition: 'border-color .15s',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = PRIMARY; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = BORDER; }}
                >
                  <div style={{ width: '100%', height: 40, background: SWATCH_GRADIENT, filter: f.preview, position: 'relative' }}>
                    {active && (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 9, color: active ? PRIMARY : MUTED, padding: '2px 4px', textAlign: 'center', background: '#1a1a2e', fontWeight: active ? 600 : 400 }}>
                    {f.label}
                  </div>
                </button>
              );
            })}
          </div>
          {canvasFilter && (
            <button
              onClick={onClearCanvasFilter}
              style={{ width: '100%', padding: '6px 0', borderRadius: 7, border: `1px solid ${BORDER}`, background: 'transparent', color: MUTED, fontSize: 11, cursor: 'pointer' }}
            >
              × Скинути фільтр полотна
            </button>
          )}
        </div>

        {/* Per-object filter section */}
        <div style={{ padding: '10px 10px 12px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: MUTED, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 6 }}>
            На виділений об'єкт
          </div>
          <div style={{ fontSize: 10, color: MUTED, marginBottom: 8, lineHeight: 1.5 }}>
            Виберіть зображення на полотні, потім натисніть фільтр.
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => onApplyFilter(f)}
                title={`Об'єкт: ${f.label}`}
                style={{
                  padding: 0, border: `1px solid ${BORDER}`, borderRadius: 6, overflow: 'hidden',
                  cursor: 'pointer', background: 'transparent', transition: 'border-color .15s',
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = PRIMARY}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = BORDER}
              >
                <div style={{ width: '100%', height: 40, background: SWATCH_GRADIENT, filter: f.preview }} />
                <div style={{ fontSize: 9, color: MUTED, padding: '2px 4px', textAlign: 'center', background: '#1a1a2e' }}>
                  {f.label}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
