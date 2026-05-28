import { useRef, useState, type ReactNode } from 'react';
import { fabric } from 'fabric';

interface LayersPanelProps {
  canvas: fabric.Canvas | null;
  objects: fabric.Object[];
  selectedObject: fabric.Object | null;
  onSelect: (obj: fabric.Object) => void;
  onRefresh: () => void;
  onReorder: () => void;
}

function getObjectLabel(obj: fabric.Object): string {
  if (obj.type === 'textbox' || obj.type === 'i-text' || obj.type === 'text') {
    const text = (obj as fabric.Textbox).text || '';
    return text.length > 18 ? text.slice(0, 18) + '…' : text || 'Текст';
  }
  if (obj.type === 'image') return 'Зображення';
  if (obj.type === 'rect') return 'Прямокутник';
  if (obj.type === 'circle') return 'Коло';
  if (obj.type === 'ellipse') return 'Еліпс';
  if (obj.type === 'triangle') return 'Трикутник';
  if (obj.type === 'line') return 'Лінія';
  if (obj.type === 'path') {
    const lbl: string = (obj as any)._label || '';
    if (lbl) return lbl.replace(/^[^\s]+\s/, '');
    return 'Контур';
  }
  return obj.type || 'Об\'єкт';
}

function getObjectIcon(obj: fabric.Object): ReactNode {
  const type = obj.type;
  const c = '#6b6b90';
  const s = { width: 13, height: 13 } as const;

  if (type === 'textbox' || type === 'i-text' || type === 'text')
    return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="6" x2="20" y2="6"/><line x1="12" y1="6" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/></svg>;

  if (type === 'image')
    return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.2"/><polyline points="21 15 16 10 5 21"/></svg>;

  if (type === 'rect')
    return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="1.5"/></svg>;

  if (type === 'circle' || type === 'ellipse')
    return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><ellipse cx="12" cy="12" rx="9" ry="7"/></svg>;

  if (type === 'line')
    return <svg {...s} viewBox="0 0 24 24" stroke={c} strokeWidth="2.2" strokeLinecap="round"><line x1="4" y1="20" x2="20" y2="4"/></svg>;

  if (type === 'path') {
    const lbl: string = (obj as any)._label || '';
    if (lbl.startsWith('◇')) return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><polygon points="12,2 22,12 12,22 2,12"/></svg>;
    if (lbl.startsWith('⏢')) return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><polygon points="6,4 18,4 22,20 2,20"/></svg>;
    if (lbl.startsWith('◺')) return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinejoin="round"><polygon points="4,4 4,20 20,20"/></svg>;
    if (lbl.startsWith('▢')) return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><rect x="3" y="5" width="18" height="14" rx="4"/></svg>;
    if (lbl.startsWith('→')) return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="12" x2="18" y2="12"/><polyline points="13 7 18 12 13 17"/></svg>;
    return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>;
  }

  return <svg {...s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>;
}

const EyeOpen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOff = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);
const LockClosed = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const LockOpen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
  </svg>
);

const BG      = '#1a1a2e';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const PRIMARY = '#6c63ff';

export default function LayersPanel({ canvas, objects, selectedObject, onSelect, onRefresh, onReorder }: LayersPanelProps) {
  const reversed = [...objects].reverse();
  const dragIndexRef = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const toggleVisibility = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    obj.set('visible', !obj.visible);
    canvas?.renderAll();
    onRefresh();
  };

  const toggleLock = (obj: fabric.Object, e: React.MouseEvent) => {
    e.stopPropagation();
    const locked = (obj as any)._locked;
    obj.set({ selectable: locked, evented: locked });
    (obj as any)._locked = !locked;
    canvas?.renderAll();
    onRefresh();
  };

  const onDragStart = (ri: number) => { dragIndexRef.current = ri; };
  const onDragEnter = (ri: number) => { setDragOver(ri); };

  const onDrop = (targetRi: number) => {
    const srcRi = dragIndexRef.current;
    if (srcRi === null || srcRi === targetRi || !canvas) return;
    const srcI = objects.length - 1 - srcRi;
    const tgtI = objects.length - 1 - targetRi;
    const internal = (canvas as any)._objects as fabric.Object[];
    const [moved] = internal.splice(srcI, 1);
    internal.splice(tgtI, 0, moved);
    canvas.renderAll();
    onRefresh();
    onReorder();
    dragIndexRef.current = null;
    setDragOver(null);
  };

  const onDragEnd = () => { dragIndexRef.current = null; setDragOver(null); };

  return (
    <div style={{ width: 172, background: BG, borderRight: `1px solid ${BORDER}`, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
      <div style={{ padding: '12px 14px', borderBottom: `1px solid ${BORDER}`, fontSize: 13, fontWeight: 600, color: TEXT }}>
        Шари ({objects.length})
      </div>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {reversed.length === 0 && (
          <div style={{ padding: 16, color: MUTED, fontSize: 12, textAlign: 'center' }}>
            Немає шарів.<br />Додайте фігури або текст.
          </div>
        )}
        {reversed.map((obj, ri) => {
          const isSelected = obj === selectedObject;
          const isLocked = (obj as any)._locked;
          const isHidden = !obj.visible;
          const isDragTarget = dragOver === ri;
          return (
            <div
              key={ri}
              draggable
              onDragStart={() => onDragStart(ri)}
              onDragEnter={() => onDragEnter(ri)}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(ri)}
              onDragEnd={onDragEnd}
              onClick={() => { if (!isLocked) { canvas?.setActiveObject(obj); canvas?.renderAll(); onSelect(obj); } }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '7px 10px',
                background: isDragTarget ? 'rgba(108,99,255,.2)' : isSelected ? 'rgba(108,99,255,.12)' : 'transparent',
                cursor: isLocked ? 'default' : 'pointer',
                borderBottom: isDragTarget ? `2px solid ${PRIMARY}` : `1px solid ${BORDER}`,
                opacity: isHidden ? 0.4 : 1,
                transition: 'background 0.1s',
                userSelect: 'none',
              }}
              onMouseEnter={e => { if (!isSelected && !isDragTarget) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,.04)'; }}
              onMouseLeave={e => { if (!isSelected && !isDragTarget) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{ fontSize: 11, color: MUTED, cursor: 'grab', flexShrink: 0, paddingRight: 1 }}>⠿</span>
              <span style={{ flexShrink: 0, color: isSelected ? PRIMARY : MUTED, display: 'flex', alignItems: 'center' }}>
                {getObjectIcon(obj)}
              </span>
              <span style={{
                flex: 1, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                color: isSelected ? PRIMARY : TEXT,
              }}>
                {getObjectLabel(obj)}
              </span>
              <button
                onClick={e => toggleVisibility(obj, e)}
                title={isHidden ? 'Показати' : 'Сховати'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isHidden ? MUTED : '#a0a0c0', padding: 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}
              >
                {isHidden ? <EyeOff /> : <EyeOpen />}
              </button>
              <button
                onClick={e => toggleLock(obj, e)}
                title={isLocked ? 'Розблокувати' : 'Заблокувати'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: isLocked ? '#6c63ff' : MUTED, padding: 2, flexShrink: 0, display: 'flex', alignItems: 'center' }}
              >
                {isLocked ? <LockClosed /> : <LockOpen />}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
