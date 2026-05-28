import { useRef, useState } from 'react';
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
  if (obj.type === 'path') {
    const lbl: string = (obj as any)._label || '';
    if (lbl) return lbl.replace(/^[^\s]+\s/, '');
    return 'Контур';
  }
  return obj.type || 'Об\'єкт';
}

function getObjectIcon(obj: fabric.Object): string {
  const type = obj.type;
  if (type === 'textbox' || type === 'i-text' || type === 'text') return 'T';
  if (type === 'image') return '🖼';
  if (type === 'rect') return '▭';
  if (type === 'circle' || type === 'ellipse') return '○';
  if (type === 'triangle') return '△';
  if (type === 'path') {
    const lbl: string = (obj as any)._label || '';
    if (lbl.startsWith('◇')) return '◇';
    if (lbl.startsWith('⏢')) return '⏢';
    if (lbl.startsWith('◺')) return '◺';
    if (lbl.startsWith('▢')) return '▢';
    if (lbl.startsWith('→')) return '→';
    return '✏';
  }
  return '◈';
}

const BG     = '#1a1a2e';
const BORDER  = '#2d2d45';
const TEXT    = '#d0d0e8';
const MUTED   = '#6b6b90';
const PRIMARY = '#6c63ff';

export default function LayersPanel({ canvas, objects, selectedObject, onSelect, onRefresh, onReorder }: LayersPanelProps) {
  const reversed = [...objects].reverse();
  const dragIndexRef = useRef<number | null>(null); // index in `reversed`
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

  const onDragStart = (ri: number) => {
    dragIndexRef.current = ri;
  };

  const onDragEnter = (ri: number) => {
    setDragOver(ri);
  };

  const onDrop = (targetRi: number) => {
    const srcRi = dragIndexRef.current;
    if (srcRi === null || srcRi === targetRi || !canvas) return;

    // reversed indices → original indices in _objects array
    const srcI = objects.length - 1 - srcRi;
    const tgtI = objects.length - 1 - targetRi;

    // Manipulate internal array directly — no object:added/removed events fired
    const internal = (canvas as any)._objects as fabric.Object[];
    const [moved] = internal.splice(srcI, 1);
    internal.splice(tgtI, 0, moved);
    canvas.renderAll();
    onRefresh();
    onReorder();

    dragIndexRef.current = null;
    setDragOver(null);
  };

  const onDragEnd = () => {
    dragIndexRef.current = null;
    setDragOver(null);
  };

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
              <span style={{ fontSize: 13, flexShrink: 0, color: isSelected ? PRIMARY : MUTED }}>{getObjectIcon(obj)}</span>
              <span style={{
                flex: 1, fontSize: 11, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                color: isSelected ? PRIMARY : TEXT,
              }}>
                {getObjectLabel(obj)}
              </span>
              <button onClick={(e) => toggleVisibility(obj, e)} title={isHidden ? 'Показати' : 'Сховати'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, opacity: 0.55, padding: 2, flexShrink: 0 }}>
                {isHidden ? '🙈' : '👁'}
              </button>
              <button onClick={(e) => toggleLock(obj, e)} title={isLocked ? 'Розблокувати' : 'Заблокувати'}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 11, opacity: 0.55, padding: 2, flexShrink: 0 }}>
                {isLocked ? '🔒' : '🔓'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
