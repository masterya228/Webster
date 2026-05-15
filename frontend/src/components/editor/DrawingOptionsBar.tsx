export type FillMode = 'filled' | 'outline' | 'both';

export interface DrawingOptions {
  fillColor: string;
  setFillColor: (c: string) => void;
  strokeColor: string;
  setStrokeColor: (c: string) => void;
  strokeWidth: number;
  setStrokeWidth: (n: number) => void;
  brushSize: number;
  setBrushSize: (n: number) => void;
  fillMode: FillMode;
  setFillMode: (m: FillMode) => void;
  opacity: number;
  setOpacity: (n: number) => void;
}

const SHAPE_TOOLS = [
  'draw-rect','draw-square','draw-circle','draw-rounded-rect',
  'draw-diamond','draw-trapezoid','draw-right-triangle',
];
const BRUSH_TOOLS = ['pencil', 'brush'];

interface Props extends DrawingOptions {
  activeTool: string;
}

export default function DrawingOptionsBar(p: Props) {
  const isShape = SHAPE_TOOLS.includes(p.activeTool);
  const isBrush = BRUSH_TOOLS.includes(p.activeTool);
  const showFill  = isShape || p.activeTool === 'fill';
  const showStroke = isShape;
  const showBrush = isBrush;

  const sep = <div style={{ width: 1, background: '#e2e0f0', alignSelf: 'stretch', margin: '0 4px' }} />;

  const label = (txt: string) => (
    <span style={{ fontSize: 11, color: '#6b6b8d', marginRight: 4, whiteSpace: 'nowrap' }}>{txt}</span>
  );

  const colorSwatch = (color: string, onChange: (c: string) => void, title: string) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      {label(title)}
      <label style={{ position: 'relative', cursor: 'pointer' }}>
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: color,
          border: '2px solid #d1d0e0',
          boxShadow: '0 1px 4px rgba(0,0,0,.12)',
          cursor: 'pointer',
        }} />
        <input type="color" value={color} onChange={(e) => onChange(e.target.value)}
          style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }} />
      </label>
      <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#888', minWidth: 52 }}>{color}</span>
    </div>
  );

  const fillModeBtn = (mode: FillMode, icon: string, title: string) => (
    <button title={title} onClick={() => p.setFillMode(mode)} style={{
      padding: '4px 10px', borderRadius: 6, border: '1.5px solid',
      borderColor: p.fillMode === mode ? 'var(--primary)' : 'var(--border)',
      background: p.fillMode === mode ? 'var(--primary)' : 'transparent',
      color: p.fillMode === mode ? '#fff' : 'var(--text-muted)',
      fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
    }}>
      {icon}
    </button>
  );

  return (
    <div style={{
      height: 44, background: 'var(--surface)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', padding: '0 14px', gap: 10, flexShrink: 0,
      overflowX: 'auto',
    }}>
      {showFill && colorSwatch(p.fillColor, p.setFillColor, 'Заливка')}

      {showStroke && (
        <>
          {showFill && sep}
          {colorSwatch(p.strokeColor, p.setStrokeColor, 'Контур')}
          {sep}
          {label('Товщина')}
          <input type="number" min={1} max={50} value={p.strokeWidth}
            onChange={(e) => p.setStrokeWidth(Number(e.target.value))}
            style={{ width: 48, padding: '3px 6px', borderRadius: 6, border: '1px solid var(--border)', fontSize: 13 }} />
        </>
      )}

      {isShape && (
        <>
          {sep}
          {label('Режим')}
          <div style={{ display: 'flex', gap: 4 }}>
            {fillModeBtn('filled',  '● Заливка',  'Тільки заливка')}
            {fillModeBtn('outline', '○ Контур',   'Тільки контур')}
            {fillModeBtn('both',    '◉ Обидва',   'Заливка + контур')}
          </div>
        </>
      )}

      {showBrush && (
        <>
          {colorSwatch(p.fillColor, p.setFillColor, 'Колір')}
          {sep}
          {label('Розмір')}
          <input type="range" min={1} max={80} value={p.brushSize}
            onChange={(e) => p.setBrushSize(Number(e.target.value))}
            style={{ width: 100 }} />
          <span style={{ fontSize: 12, color: '#888', minWidth: 24 }}>{p.brushSize}</span>
        </>
      )}

      {sep}
      {label('Прозорість')}
      <input type="range" min={0} max={100} value={Math.round(p.opacity * 100)}
        onChange={(e) => p.setOpacity(Number(e.target.value) / 100)}
        style={{ width: 80 }} />
      <span style={{ fontSize: 12, color: '#888', minWidth: 28 }}>{Math.round(p.opacity * 100)}%</span>

      {p.activeTool === 'eyedropper' && (
        <span style={{ fontSize: 12, color: 'var(--primary)', marginLeft: 8 }}>
          Клікніть на будь-яке місце на полотні, щоб підібрати колір
        </span>
      )}
      {p.activeTool === 'fill' && (
        <span style={{ fontSize: 12, color: 'var(--primary)', marginLeft: 8 }}>
          Клікніть на об'єкт або фон для заливки
        </span>
      )}
      {p.activeTool === 'magic-wand' && (
        <span style={{ fontSize: 12, color: 'var(--primary)', marginLeft: 8 }}>
          Клікніть на об'єкт для вибору всіх схожих за кольором
        </span>
      )}
    </div>
  );
}
