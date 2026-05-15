import { useState } from 'react';

interface ToolbarProps {
  activeTool: string;
  setActiveTool: (t: string) => void;
  onQuickCreate: (tool: string) => void;
  onUploadImage: () => void;
  onAddText: () => void;
  onDelete: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
  onToggleTemplates: () => void;
  templatesOpen: boolean;
  onToggleStickers: () => void;
  stickersOpen: boolean;
}

interface ToolDef { id: string; label: string; icon: React.ReactNode; action?: () => void; }

const SHAPES = [
  { id: 'draw-rect',           label: 'Прямокутник',      icon: '▭' },
  { id: 'draw-circle',         label: 'Коло / еліпс',     icon: '○' },
  { id: 'draw-rounded-rect',   label: 'Заокруглений прямокутник', icon: '▢' },
  { id: 'draw-diamond',        label: 'Ромб',             icon: '◇' },
  { id: 'draw-trapezoid',      label: 'Трапеція',         icon: '⏢' },
  { id: 'draw-right-triangle', label: 'Прям. трикутник',  icon: '◺' },
];

const BG     = '#1a1a2e';
const BORDER = '#2d2d45';
const W      = 152;
const BTN_W  = W - 12;

const Ic = {
  cursor: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 2l16 10-7 1.5L9 21z"/>
    </svg>
  ),
  pencil: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
    </svg>
  ),
  text: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="12" y1="6" x2="12" y2="20"/><line x1="8" y1="20" x2="16" y2="20"/>
    </svg>
  ),
  image: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
    </svg>
  ),
  sticker: <span style={{ fontSize: 13 }}>😀</span>,
  templates: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>
    </svg>
  ),
  undo: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
    </svg>
  ),
  redo: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
    </svg>
  ),
  toFront: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="8" width="13" height="13" rx="1"/><path d="M3 16v-11a2 2 0 0 1 2-2h11" strokeDasharray="3 2"/>
      <line x1="14" y1="11" x2="14" y2="5"/><polyline points="11 8 14 5 17 8"/>
    </svg>
  ),
  forward: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="10" width="13" height="10" rx="1"/>
      <rect x="9" y="5" width="13" height="10" rx="1" fill="currentColor" opacity=".25"/>
      <line x1="11" y1="7" x2="11" y2="2"/><polyline points="8 5 11 2 14 5"/>
    </svg>
  ),
  backward: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="13" height="10" rx="1"/>
      <rect x="8" y="10" width="13" height="10" rx="1" fill="currentColor" opacity=".25"/>
      <line x1="14" y1="17" x2="14" y2="22"/><polyline points="11 19 14 22 17 19"/>
    </svg>
  ),
  toBack: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="13" height="13" rx="1"/><path d="M8 13v7a2 2 0 0 0 2 2h7" strokeDasharray="3 2"/>
      <line x1="10" y1="13" x2="10" y2="19"/><polyline points="7 16 10 19 13 16"/>
    </svg>
  ),
  trash: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
    </svg>
  ),
};

export default function Toolbar({
  activeTool, setActiveTool, onQuickCreate,
  onUploadImage, onAddText,
  onDelete, onUndo, onRedo,
  onBringForward, onSendBackward,
  onBringToFront, onSendToBack,
  onToggleTemplates, templatesOpen,
  onToggleStickers, stickersOpen,
}: ToolbarProps) {
  const [shapesOpen, setShapesOpen] = useState(true);

  const activeShape = SHAPES.find(s => s.id === activeTool);

  const btn = (tool: ToolDef, forceActive?: boolean) => {
    const active = forceActive ?? activeTool === tool.id;
    return (
      <button
        key={tool.id}
        title={tool.label}
        onClick={() => {
          if (tool.action) tool.action();
          if (!tool.id.startsWith('_')) setActiveTool(tool.id);
        }}
        style={{
          width: BTN_W, height: 34,
          display: 'flex', alignItems: 'center', gap: 7,
          padding: '0 9px', borderRadius: 7, border: 'none',
          background: active ? 'var(--primary)' : 'transparent',
          color: active ? '#fff' : '#bbb',
          cursor: 'pointer', transition: 'background .15s, color .15s',
          justifyContent: 'flex-start', flexShrink: 0,
        }}
        onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = BORDER; }}
        onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
      >
        <span style={{ minWidth: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{tool.icon}</span>
        <span style={{ fontSize: 10.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tool.label}</span>
      </button>
    );
  };

  const sectionLabel = (title: string) => (
    <div style={{ fontSize: 9, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.08em', padding: '8px 8px 3px' }}>
      {title}
    </div>
  );

  const iconBtn = (id: string, label: string, icon: React.ReactNode, active: boolean, onClick: () => void) => (
    <button
      key={id}
      title={label}
      onClick={onClick}
      style={{
        width: BTN_W, height: 34,
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '0 9px', borderRadius: 7, border: 'none',
        background: active ? 'var(--primary)' : 'transparent',
        color: active ? '#fff' : '#bbb',
        cursor: 'pointer', transition: 'background .15s',
        justifyContent: 'flex-start', flexShrink: 0,
      }}
      onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = BORDER; }}
      onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ minWidth: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</span>
      <span style={{ fontSize: 10.5, whiteSpace: 'nowrap' }}>{label}</span>
    </button>
  );

  const actions: ToolDef[] = [
    { id: '_undo',  label: 'Відміна (Ctrl+Z)',  icon: Ic.undo,     action: onUndo },
    { id: '_redo',  label: 'Повтор (Ctrl+Y)',   icon: Ic.redo,     action: onRedo },
    { id: '_top',   label: 'На найвищий шар',   icon: Ic.toFront,  action: onBringToFront },
    { id: '_fwd',   label: 'На передній план',  icon: Ic.forward,  action: onBringForward },
    { id: '_bwd',   label: 'На задній план',    icon: Ic.backward, action: onSendBackward },
    { id: '_bot',   label: 'На найнижчий шар',  icon: Ic.toBack,   action: onSendToBack },
    { id: '_del',   label: 'Видалити (Del)',     icon: Ic.trash,    action: onDelete },
  ];

  return (
    <div style={{
      width: W, background: BG, display: 'flex', flexDirection: 'column',
      borderRight: `1px solid ${BORDER}`, flexShrink: 0, overflowY: 'auto', overflowX: 'hidden',
      paddingBottom: 12,
    }}>

      {sectionLabel('Вибір')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
        {btn({ id: 'select', label: 'Вибір', icon: Ic.cursor })}
      </div>

      {sectionLabel('Малювання')}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
        {btn({ id: 'pencil', label: 'Олівець', icon: Ic.pencil })}
      </div>

      <div>
        <button
          onClick={() => setShapesOpen(o => !o)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '8px 8px 3px', background: 'transparent', border: 'none', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: 9, fontWeight: 600, color: '#555', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            {activeShape ? `${activeShape.icon} ${activeShape.label}` : 'Форми'}
          </span>
          <span style={{ fontSize: 9, color: '#555', paddingRight: 4 }}>{shapesOpen ? '▲' : '▼'}</span>
        </button>
        {shapesOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
            {SHAPES.map(s => btn({
              id: s.id, label: s.label, icon: <span style={{ fontSize: 13 }}>{s.icon}</span>,
              action: activeTool === s.id ? () => onQuickCreate(s.id) : undefined,
            }))}
          </div>
        )}
      </div>

      {sectionLabel("Об'єкти")}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
        {btn({ id: 'text',  label: 'Текст',      icon: Ic.text,  action: onAddText })}
        {btn({ id: 'image', label: 'Зображення', icon: Ic.image, action: onUploadImage })}
      </div>

      {sectionLabel('Стікери')}
      <div style={{ padding: '0 4px' }}>
        {iconBtn('stickers', 'Стікери', Ic.sticker, stickersOpen, onToggleStickers)}
      </div>

      {sectionLabel('Шаблони')}
      <div style={{ padding: '0 4px' }}>
        {iconBtn('templates', 'Шаблони', Ic.templates, templatesOpen, onToggleTemplates)}
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ height: 1, background: BORDER, margin: '8px 8px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 1, padding: '0 4px' }}>
        {actions.map(a => btn(a))}
      </div>
    </div>
  );
}
