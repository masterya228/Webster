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
    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, marginTop: 16 }}>{title}</div>
  );

  const row = (label: string, control: React.ReactNode) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
      <label style={{ fontSize: 12, color: 'var(--text-muted)', width: 72, flexShrink: 0 }}>{label}</label>
      <div style={{ flex: 1 }}>{control}</div>
    </div>
  );

  const numInput = (prop: string, value: number | undefined, min = 0, max = 9999, step = 1) => (
    <input type="number" value={Math.round(value ?? 0)} min={min} max={max} step={step}
      onChange={(e) => set(prop, parseFloat(e.target.value))}
      style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)' }}
    />
  );

  return (
    <div style={{ width: 270, background: 'var(--surface)', borderLeft: '1px solid var(--border)', padding: '16px', overflowY: 'auto', flexShrink: 0 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Властивості</h3>

      {sectionTitle('Фон полотна')}
      <input type="color" value={background} onChange={(e) => onBackgroundChange(e.target.value)}
        style={{ width: '100%', height: 36, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />

      {!obj && SHAPE_TOOLS.includes(tp.activeTool) && (
        <>
          {sectionTitle('Новий об\'єкт')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input type="checkbox" id="tl-fill" checked={tp.fillMode !== 'outline'}
              onChange={e => { if (!e.target.checked && tp.fillMode === 'both') tp.setFillMode('outline'); else if (e.target.checked) tp.setFillMode(tp.fillMode === 'outline' ? (tp.strokeColor !== 'transparent' ? 'both' : 'filled') : tp.fillMode); }}
              style={{ accentColor: 'var(--primary)', width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="tl-fill" style={{ fontSize: 12, color: 'var(--text-muted)', width: 56, flexShrink: 0, cursor: 'pointer' }}>Заливка</label>
            <input type="color" value={tp.fillColor} disabled={tp.fillMode === 'outline'}
              onChange={e => tp.setFillColor(e.target.value)}
              style={{ flex: 1, height: 30, borderRadius: 6, border: '1px solid var(--border)', cursor: tp.fillMode !== 'outline' ? 'pointer' : 'not-allowed', padding: 2, opacity: tp.fillMode !== 'outline' ? 1 : 0.4 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <input type="checkbox" id="tl-stroke" checked={tp.fillMode !== 'filled'}
              onChange={e => { if (!e.target.checked && tp.fillMode === 'filled') return; tp.setFillMode(e.target.checked ? (tp.fillMode === 'filled' ? 'both' : tp.fillMode) : 'filled'); }}
              style={{ accentColor: 'var(--primary)', width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
            <label htmlFor="tl-stroke" style={{ fontSize: 12, color: 'var(--text-muted)', width: 56, flexShrink: 0, cursor: 'pointer' }}>Контур</label>
            <input type="color" value={tp.strokeColor} disabled={tp.fillMode === 'filled'}
              onChange={e => tp.setStrokeColor(e.target.value)}
              style={{ flex: 1, height: 30, borderRadius: 6, border: '1px solid var(--border)', cursor: tp.fillMode !== 'filled' ? 'pointer' : 'not-allowed', padding: 2, opacity: tp.fillMode !== 'filled' ? 1 : 0.4 }} />
          </div>
          {tp.fillMode !== 'filled' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <label style={{ fontSize: 12, color: 'var(--text-muted)', width: 72, flexShrink: 0 }}>Товщина</label>
              <input type="number" value={tp.strokeWidth} min={1} max={50}
                onChange={e => tp.setStrokeWidth(Number(e.target.value))}
                style={{ flex: 1, padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)' }} />
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', width: 72, flexShrink: 0 }}>Прозорість</label>
            <input type="range" min={0} max={1} step={0.01} value={tp.opacity}
              onChange={e => tp.setOpacity(Number(e.target.value))}
              style={{ flex: 1 }} />
          </div>
        </>
      )}

      {!obj && tp.activeTool === 'pencil' && (
        <>
          {sectionTitle('Олівець')}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', width: 72, flexShrink: 0 }}>Колір</label>
            <input type="color" value={tp.fillColor} onChange={e => tp.setFillColor(e.target.value)}
              style={{ flex: 1, height: 30, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', width: 72, flexShrink: 0 }}>Розмір</label>
            <input type="range" min={1} max={80} value={tp.brushSize} onChange={e => tp.setBrushSize(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 24 }}>{tp.brushSize}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: 'var(--text-muted)', width: 72, flexShrink: 0 }}>Прозорість</label>
            <input type="range" min={0} max={1} step={0.01} value={tp.opacity} onChange={e => tp.setOpacity(Number(e.target.value))} style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: 'var(--text-muted)', minWidth: 28 }}>{Math.round(tp.opacity * 100)}%</span>
          </div>
        </>
      )}

      {!obj && !SHAPE_TOOLS.includes(tp.activeTool) && tp.activeTool !== 'pencil' && (
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 24, textAlign: 'center' }}>
          Оберіть об'єкт для редагування властивостей
        </p>
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
              onChange={(e) => set('opacity', parseFloat(e.target.value))}
              style={{ width: '100%' }} />
          ))}

          {obj.type === 'path' && !(obj as any)._label && (
            <>
              {sectionTitle('Олівець')}
              {row('Колір', (
                <input type="color" value={(obj as any).stroke || '#000000'}
                  onChange={(e) => set('stroke', e.target.value)}
                  style={{ width: '100%', height: 30, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
              ))}
              {row('Розмір', numInput('strokeWidth', (obj as any).strokeWidth, 1, 200))}
              {row('Прозорість', (
                <input type="range" min={0} max={1} step={0.01} value={(obj as any).opacity ?? 1}
                  onChange={(e) => set('opacity', parseFloat(e.target.value))}
                  style={{ width: '100%' }} />
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
                const strokeVal = hasStroke ? (obj as any).stroke : '#1a1a2e';
                return (
                  <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input type="checkbox" id="chk-fill" checked={hasFill}
                        onChange={e => { if (!e.target.checked && !hasStroke) return; set('fill', e.target.checked ? fillVal : 'transparent'); }}
                        style={{ accentColor: 'var(--primary)', width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
                      <label htmlFor="chk-fill" style={{ fontSize: 12, color: 'var(--text-muted)', width: 56, flexShrink: 0, cursor: 'pointer' }}>Заливка</label>
                      <input type="color" value={fillVal} disabled={!hasFill}
                        onChange={e => set('fill', e.target.value)}
                        style={{ flex: 1, height: 30, borderRadius: 6, border: '1px solid var(--border)', cursor: hasFill ? 'pointer' : 'not-allowed', padding: 2, opacity: hasFill ? 1 : 0.4 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <input type="checkbox" id="chk-stroke" checked={hasStroke}
                        onChange={e => { if (!e.target.checked && !hasFill) return; set('stroke', e.target.checked ? strokeVal : 'transparent'); }}
                        style={{ accentColor: 'var(--primary)', width: 14, height: 14, cursor: 'pointer', flexShrink: 0 }} />
                      <label htmlFor="chk-stroke" style={{ fontSize: 12, color: 'var(--text-muted)', width: 56, flexShrink: 0, cursor: 'pointer' }}>Контур</label>
                      <input type="color" value={strokeVal} disabled={!hasStroke}
                        onChange={e => set('stroke', e.target.value)}
                        style={{ flex: 1, height: 30, borderRadius: 6, border: '1px solid var(--border)', cursor: hasStroke ? 'pointer' : 'not-allowed', padding: 2, opacity: hasStroke ? 1 : 0.4 }} />
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
                <select value={(obj as any).fontFamily || 'Inter'}
                  onChange={(e) => set('fontFamily', e.target.value)}
                  style={{ width: '100%', padding: '5px 8px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13, background: 'var(--bg)' }}>
                  {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              ))}
              {row('Розмір', numInput('fontSize', (obj as any).fontSize, 6, 300))}
              {row('Колір', (
                <input type="color" value={(obj as any).fill || '#000000'}
                  onChange={(e) => set('fill', e.target.value)}
                  style={{ width: '100%', height: 32, borderRadius: 6, border: '1px solid var(--border)', cursor: 'pointer', padding: 2 }} />
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
                    padding: '5px 10px', borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg)', fontSize: 13, cursor: 'pointer',
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
                      flex: 1, padding: '5px', borderRadius: 6, border: '1px solid var(--border)',
                      background: (obj as any).textAlign === a ? 'var(--primary)' : 'var(--bg)',
                      color: (obj as any).textAlign === a ? '#fff' : 'var(--text)',
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
                onChange={(e) => setBrightness(parseFloat(e.target.value))}
                style={{ width: '100%' }} />
              {sectionTitle('Фільтри')}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {FILTER_PRESETS.map((fp) => (
                  <button key={fp.label} onClick={() => applyFilter(fp.filters)} style={{
                    padding: '6px 4px', borderRadius: 6, border: '1px solid var(--border)',
                    background: 'var(--bg)', fontSize: 11, cursor: 'pointer',
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
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
          Історія ({historySteps.length})
        </div>
        <div style={{
          maxHeight: 220, overflowY: 'auto', border: '1px solid var(--border)',
          borderRadius: 8, background: 'var(--bg)',
        }}>
          {historySteps.length === 0 && (
            <div style={{ fontSize: 11, color: 'var(--text-muted)', padding: '10px 10px' }}>Порожньо</div>
          )}
          {[...historySteps].reverse().map((lbl, ri) => {
            const i = historySteps.length - 1 - ri;
            const isActive = i === historyIndex;
            const isFuture = i > historyIndex;
            return (
              <button key={i} onClick={() => onJumpHistory(i)} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                width: '100%', padding: '5px 10px', border: 'none',
                background: isActive ? 'rgba(108,99,255,.18)' : 'transparent',
                color: isActive ? 'var(--primary)' : isFuture ? 'var(--text-muted)' : 'var(--text)',
                fontSize: 11, cursor: 'pointer', textAlign: 'left',
                textDecoration: isFuture ? 'line-through' : 'none',
                opacity: isFuture ? 0.45 : 1,
                borderLeft: isActive ? '2px solid var(--primary)' : '2px solid transparent',
              }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 10, minWidth: 18, textAlign: 'right', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lbl}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
