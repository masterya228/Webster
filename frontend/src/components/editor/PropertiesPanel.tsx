import { fabric } from 'fabric';

type FillMode = 'filled' | 'outline' | 'both';

interface ToolProps {
  activeTool: string;
  fillColor: string;    setFillColor: (c: string) => void;
  strokeColor: string;  setStrokeColor: (c: string) => void;
  strokeWidth: number;  setStrokeWidth: (n: number) => void;
  fillMode: FillMode;   setFillMode: (m: FillMode) => void;
  opacity: number;      setOpacity: (n: number) => void;
  brushSize: number;    setBrushSize: (n: number) => void;
}

interface PropertiesPanelProps {
  selectedObject: fabric.Object | null;
  canvas: fabric.Canvas | null;
  onUpdate: () => void;
  background: string;
  onBackgroundChange: (color: string) => void;
  historySteps: string[];
  historyIndex: number;
  onJumpHistory: (i: number) => void;
  toolProps: ToolProps;
}

const FONTS = ['Inter', 'Arial', 'Georgia', 'Times New Roman', 'Courier New', 'Verdana', 'Impact', 'Comic Sans MS', 'Trebuchet MS', 'Palatino'];
const FILTER_PRESETS = [
  { label: 'Без фільтру', filters: [] },
  { label: 'Сірий', filters: [new fabric.Image.filters.Grayscale()] },
  { label: 'Сепія', filters: [new fabric.Image.filters.Sepia()] },
  { label: 'Інверсія', filters: [new fabric.Image.filters.Invert()] },
  { label: 'Розмиття', filters: [new fabric.Image.filters.Blur({ blur: 0.2 })] },
  { label: 'Різкість', filters: [new fabric.Image.filters.Convolute({ matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0] })] },
  { label: 'Рельєф', filters: [new fabric.Image.filters.Convolute({ matrix: [1, 1, 1, 1, 0.7, -1, -1, -1, -1] })] },
];

const SHAPE_TOOLS = ['draw-rect','draw-circle','draw-rounded-rect','draw-diamond','draw-trapezoid','draw-right-triangle'];

const BG     = '#1a1a2e';
const SURFACE = '#20203a';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const INPUT   = '#16162a';
const PRIMARY = '#6c63ff';

const PANEL_STYLES = `
  .props-panel input[type="range"] {
    -webkit-appearance: none; appearance: none;
    height: 4px; border-radius: 2px; outline: none; cursor: pointer;
    background: #2d2d45;
  }
  .props-panel input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 14px; height: 14px; border-radius: 50%;
    background: #6c63ff; cursor: pointer;
    box-shadow: 0 0 0 3px rgba(108,99,255,.25);
  }
  .props-panel input[type="range"]::-moz-range-thumb {
    width: 14px; height: 14px; border-radius: 50%;
    background: #6c63ff; cursor: pointer; border: none;
    box-shadow: 0 0 0 3px rgba(108,99,255,.25);
  }
  .props-panel input[type="color"] {
    -webkit-appearance: none; appearance: none;
    padding: 0; border: none; cursor: pointer; background: none;
    display: block; width: 100%; height: 100%;
  }
  .props-panel input[type="color"]::-webkit-color-swatch-wrapper { padding: 0; }
  .props-panel input[type="color"]::-webkit-color-swatch { border: none; border-radius: 5px; }
  .props-panel input[type="color"]::-moz-color-swatch { border: none; border-radius: 5px; }
  .props-panel input[type="number"] {
    background: #16162a; color: #d0d0e8; border: 1px solid #2d2d45;
    border-radius: 6px; padding: 5px 8px; font-size: 13px; width: 100%;
    outline: none; box-sizing: border-box;
  }
  .props-panel input[type="number"]:focus { border-color: #6c63ff; }
  .props-panel select {
    background: #16162a; color: #d0d0e8; border: 1px solid #2d2d45;
    border-radius: 6px; padding: 5px 8px; font-size: 13px; width: 100%;
    outline: none; cursor: pointer;
  }
  .props-panel select option { background: #1a1a2e; color: #d0d0e8; }
  .props-panel select:focus { border-color: #6c63ff; }
`;

export default function PropertiesPanel({ selectedObject, canvas, onUpdate, background, onBackgroundChange, historySteps, historyIndex, onJumpHistory, toolProps }: PropertiesPanelProps) {
  const obj = selectedObject;
  const tp = toolProps;

  const set = (prop: string, value: any) => {
    if (!obj || !canvas) return;
    (obj as any).set(prop, value);
    canvas.renderAll();
    onUpdate();
  };

  const applyFilter = (filters: fabric.IBaseFilter[]) => {
    if (!obj || obj.type !== 'image') return;
    const img = obj as fabric.Image;
    img.filters = filters;
    img.applyFilters();
    canvas?.renderAll();
    onUpdate();
  };

  const setBrightness = (value: number) => {
    if (!obj || obj.type !== 'image') return;
    const img = obj as fabric.Image;
    const existing = (img.filters || []).filter((f: any) => !(f instanceof fabric.Image.filters.Brightness));
    img.filters = [...existing, new fabric.Image.filters.Brightness({ brightness: value })];
    img.applyFilters();
    canvas?.renderAll();
    onUpdate();
  };

  const sectionTitle = (title: string) => (
    <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, marginTop: 16 }}>{title}</div>
  );

  const row = (label: string, control: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: MUTED, width: 72, flexShrink: 0 }}>{label}</label>
      <div style={{ flex: 1 }}>{control}</div>
    </div>
  );

  const numInput = (prop: string, value: number | undefined, min = 0, max = 9999, step = 1) => (
    <input type="number" value={Math.round(value ?? 0)} min={min} max={max} step={step}
      onChange={(e) => set(prop, parseFloat(e.target.value))}
    />
  );

  return (
    <div className="props-panel" style={{ width: 270, background: BG, borderLeft: `1px solid ${BORDER}`, padding: '16px', overflowY: 'auto', flexShrink: 0, color: TEXT }}>
      <style>{PANEL_STYLES}</style>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: TEXT }}>Властивості</h3>

      {sectionTitle('Фон полотна')}
      <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', height: 36 }}>
        <input type="color" value={background} onChange={(e) => onBackgroundChange(e.target.value)}
          style={{ width: '100%', height: '100%', display: 'block' }} />
      </div>

      {!obj && SHAPE_TOOLS.includes(tp.activeTool) && (
        <>
          {sectionTitle('Новий об\'єкт')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input type="checkbox" id="tl-fill" checked={tp.fillMode !== 'outline'}
              onChange={e => { if (!e.target.checked && tp.fillMode === 'both') tp.setFillMode('outline'); else if (e.target.checked) tp.setFillMode(tp.fillMode === 'outline' ? (tp.strokeColor !== 'transparent' ? 'both' : 'filled') : tp.fillMode); }}
              style={{ accentColor: PRIMARY, width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="tl-fill" style={{ fontSize: 12, color: MUTED, width: 56, flexShrink: 0, cursor: 'pointer' }}>Заливка</label>
            <div style={{ flex: 1, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden', opacity: tp.fillMode !== 'outline' ? 1 : 0.4 }}>
              <input type="color" value={tp.fillColor} disabled={tp.fillMode === 'outline'}
                onChange={e => tp.setFillColor(e.target.value)}
                style={{ cursor: tp.fillMode !== 'outline' ? 'pointer' : 'not-allowed' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input type="checkbox" id="tl-stroke" checked={tp.fillMode !== 'filled'}
              onChange={e => { if (!e.target.checked && tp.fillMode === 'filled') return; tp.setFillMode(e.target.checked ? (tp.fillMode === 'filled' ? 'both' : tp.fillMode) : 'filled'); }}
              style={{ accentColor: PRIMARY, width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="tl-stroke" style={{ fontSize: 12, color: MUTED, width: 56, flexShrink: 0, cursor: 'pointer' }}>Контур</label>
            <div style={{ flex: 1, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden', opacity: tp.fillMode !== 'filled' ? 1 : 0.4 }}>
              <input type="color" value={tp.strokeColor} disabled={tp.fillMode === 'filled'}
                onChange={e => tp.setStrokeColor(e.target.value)}
                style={{ cursor: tp.fillMode !== 'filled' ? 'pointer' : 'not-allowed' }} />
            </div>
          </div>
          {tp.fillMode !== 'filled' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: MUTED, width: 72, flexShrink: 0 }}>Товщина</label>
              <input type="number" value={tp.strokeWidth} min={1} max={50}
                onChange={e => tp.setStrokeWidth(Number(e.target.value))} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: MUTED, width: 72, flexShrink: 0 }}>Прозорість</label>
            <input type="range" min={0} max={1} step={0.01} value={tp.opacity}
              onChange={e => tp.setOpacity(Number(e.target.value))} style={{ flex: 1 }} />
          </div>
        </>
      )}

      {!obj && tp.activeTool === 'pencil' && (
        <>
          {sectionTitle('Олівець')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: MUTED, width: 72, flexShrink: 0 }}>Колір</label>
            <div style={{ flex: 1, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
              <input type="color" value={tp.fillColor} onChange={e => tp.setFillColor(e.target.value)} style={{ cursor: 'pointer' }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: MUTED, width: 72, flexShrink: 0 }}>Розмір</label>
            <input type="range" min={1} max={80} value={tp.brushSize} onChange={e => tp.setBrushSize(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: MUTED, minWidth: 24 }}>{tp.brushSize}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: MUTED, width: 72, flexShrink: 0 }}>Прозорість</label>
            <input type="range" min={0} max={1} step={0.01} value={tp.opacity} onChange={e => tp.setOpacity(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: MUTED, minWidth: 28 }}>{Math.round(tp.opacity * 100)}%</span>
          </div>
        </>
      )}

      {!obj && !SHAPE_TOOLS.includes(tp.activeTool) && tp.activeTool !== 'pencil' && tp.activeTool !== 'eyedropper' && (
        <p style={{ color: MUTED, fontSize: 13, marginTop: 24, textAlign: 'center' }}>
          Оберіть об'єкт для редагування властивостей
        </p>
      )}

      {!obj && tp.activeTool === 'eyedropper' && (
        <div style={{ marginTop: 20, padding: '14px', background: SURFACE, borderRadius: 8, border: `1px solid ${BORDER}`, textAlign: 'center' }}>
          <div style={{ fontSize: 22, marginBottom: 8 }}>💧</div>
          <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>Клікніть на будь-яку точку полотна щоб вибрати колір</p>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 6, background: tp.fillColor, border: `2px solid ${BORDER}` }} />
            <span style={{ fontSize: 12, color: TEXT, fontFamily: 'monospace' }}>{tp.fillColor}</span>
          </div>
        </div>
      )}

      {obj && (
        <>
          {sectionTitle('Трансформація')}
          {row('X', numInput('left', (obj as any).left))}
          {row('Y', numInput('top', (obj as any).top))}
          {row('Ширина', numInput('scaleX', undefined, 0.01, 20, 0.01))}
          {row('Кут', numInput('angle', (obj as any).angle, 0, 360))}
          {row('Прозорість', (
            <input type="range" min={0} max={1} step={0.01} value={(obj as any).opacity ?? 1}
              onChange={(e) => set('opacity', parseFloat(e.target.value))} style={{ width: '100%' }} />
          ))}

          {obj.type === 'path' && !(obj as any)._label && (
            <>
              {sectionTitle('Олівець')}
              {row('Колір', (
                <div style={{ height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                  <input type="color" value={(obj as any).stroke || '#000000'}
                    onChange={(e) => set('stroke', e.target.value)} style={{ cursor: 'pointer' }} />
                </div>
              ))}
              {row('Розмір', numInput('strokeWidth', (obj as any).strokeWidth, 1, 200))}
              {row('Прозорість', (
                <input type="range" min={0} max={1} step={0.01} value={(obj as any).opacity ?? 1}
                  onChange={(e) => set('opacity', parseFloat(e.target.value))} style={{ width: '100%' }} />
              ))}
            </>
          )}

          {obj.type !== 'image' && !(obj as any)._isSticker && !(obj.type === 'path' && !(obj as any)._label) && (
            <>
              {sectionTitle('Заливка і контур')}
              {(() => {
                const hasFill   = (obj as any).fill   && (obj as any).fill   !== 'transparent';
                const hasStroke = (obj as any).stroke && (obj as any).stroke !== 'transparent';
                const fillVal   = hasFill   ? (obj as any).fill   : '#6c63ff';
                const strokeVal = hasStroke ? (obj as any).stroke : '#d0d0e8';
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input type="checkbox" id="chk-fill" checked={hasFill}
                        onChange={e => { if (!e.target.checked && !hasStroke) return; set('fill', e.target.checked ? fillVal : 'transparent'); }}
                        style={{ accentColor: PRIMARY, width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
                      <label htmlFor="chk-fill" style={{ fontSize: 12, color: MUTED, width: 56, flexShrink: 0, cursor: 'pointer' }}>Заливка</label>
                      <div style={{ flex: 1, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden', opacity: hasFill ? 1 : 0.4 }}>
                        <input type="color" value={fillVal} disabled={!hasFill}
                          onChange={e => set('fill', e.target.value)}
                          style={{ cursor: hasFill ? 'pointer' : 'not-allowed' }} />
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input type="checkbox" id="chk-stroke" checked={hasStroke}
                        onChange={e => { if (!e.target.checked && !hasFill) return; set('stroke', e.target.checked ? strokeVal : 'transparent'); }}
                        style={{ accentColor: PRIMARY, width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
                      <label htmlFor="chk-stroke" style={{ fontSize: 12, color: MUTED, width: 56, flexShrink: 0, cursor: 'pointer' }}>Контур</label>
                      <div style={{ flex: 1, height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden', opacity: hasStroke ? 1 : 0.4 }}>
                        <input type="color" value={strokeVal} disabled={!hasStroke}
                          onChange={e => set('stroke', e.target.value)}
                          style={{ cursor: hasStroke ? 'pointer' : 'not-allowed' }} />
                      </div>
                    </div>
                    {hasStroke && row('Товщина', numInput('strokeWidth', (obj as any).strokeWidth, 0, 50))}
                  </>
                );
              })()}
            </>
          )}

          {(obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text') && !(obj as any)._isSticker && (
            <>
              {sectionTitle('Типографіка')}
              {row('Шрифт', (
                <select value={(obj as any).fontFamily || 'Inter'} onChange={(e) => set('fontFamily', e.target.value)}>
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              ))}
              {row('Розмір', numInput('fontSize', (obj as any).fontSize, 6, 300))}
              {row('Колір', (
                <div style={{ height: 30, borderRadius: 6, border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
                  <input type="color" value={(obj as any).fill || '#000000'}
                    onChange={(e) => set('fill', e.target.value)} style={{ cursor: 'pointer' }} />
                </div>
              ))}
              <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                {['bold', 'italic', 'underline'].map((style) => (
                  <button key={style} onClick={() => {
                    const prop = style === 'bold' ? 'fontWeight' : style === 'italic' ? 'fontStyle' : 'underline';
                    const cur = (obj as any)[prop];
                    if (style === 'bold') set('fontWeight', cur === 'bold' ? 'normal' : 'bold');
                    else if (style === 'italic') set('fontStyle', cur === 'italic' ? 'normal' : 'italic');
                    else set('underline', !cur);
                  }} style={{
                    padding: '5px 10px', borderRadius: 6, border: `1px solid ${BORDER}`,
                    background: INPUT, color: TEXT, fontSize: 13, cursor: 'pointer',
                    fontWeight: style === 'bold' ? 700 : 400,
                    fontStyle: style === 'italic' ? 'italic' : 'normal',
                  }}>
                    {style === 'bold' ? 'Ж' : style === 'italic' ? 'К' : 'П'}
                  </button>
                ))}
              </div>
              {row('Вирівнювання', (
                <div style={{ display: 'flex', gap: 4 }}>
                  {['left', 'center', 'right'].map((a) => (
                    <button key={a} onClick={() => set('textAlign', a)} style={{
                      flex: 1, padding: '5px', borderRadius: 6, border: `1px solid ${BORDER}`,
                      background: (obj as any).textAlign === a ? PRIMARY : INPUT,
                      color: (obj as any).textAlign === a ? '#fff' : TEXT,
                      fontSize: 12, cursor: 'pointer',
                    }}>
                      {a === 'left' ? '⬅' : a === 'center' ? '↔' : '➡'}
                    </button>
                  ))}
                </div>
              ))}
            </>
          )}

          {obj.type === 'image' && (
            <>
              {sectionTitle('Яскравість')}
              <input type="range" min={-1} max={1} step={0.05} defaultValue={0}
                onChange={(e) => setBrightness(parseFloat(e.target.value))} style={{ width: '100%' }} />
              {sectionTitle('Фільтри')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {FILTER_PRESETS.map((fp) => (
                  <button key={fp.label} onClick={() => applyFilter(fp.filters)} style={{
                    padding: '6px 4px', borderRadius: 6, border: `1px solid ${BORDER}`,
                    background: INPUT, color: TEXT, fontSize: 11, cursor: 'pointer',
                  }}>
                    {fp.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: MUTED, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Історія ({historySteps.length})
        </div>
        <div style={{ maxHeight: 220, overflowY: 'auto', border: `1px solid ${BORDER}`, borderRadius: 8, background: INPUT }}>
          {historySteps.length === 0 && (
            <div style={{ fontSize: 11, color: MUTED, padding: '10px 10px' }}>Порожньо</div>
          )}
          {[...historySteps].reverse().map((lbl, ri) => {
            const i = historySteps.length - 1 - ri;
            const isActive = i === historyIndex;
            const isFuture = i > historyIndex;
            return (
              <button key={i} onClick={() => onJumpHistory(i)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '5px 10px', border: 'none',
                background: isActive ? 'rgba(108,99,255,.2)' : 'transparent',
                color: isActive ? PRIMARY : isFuture ? MUTED : TEXT,
                fontSize: 11, cursor: 'pointer', textAlign: 'left',
                textDecoration: isFuture ? 'line-through' : 'none',
                opacity: isFuture ? 0.45 : 1,
                borderLeft: isActive ? `2px solid ${PRIMARY}` : '2px solid transparent',
              }}>
                <span style={{ color: MUTED, fontSize: 10, minWidth: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lbl}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
