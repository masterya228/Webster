export interface HistoryStep {
  url: string;
  label: string;
}

interface Props {
  steps: HistoryStep[];
  currentIndex: number;
  onJump: (i: number) => void;
}

const BG     = '#1a1a2e';
const BORDER = '#2d2d45';

export default function HistoryPanel({ steps, currentIndex, onJump }: Props) {
  return (
    <div style={{
      width: 148, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto', overflowX: 'hidden',
    }}>
      <div style={{
        fontSize: 9, fontWeight: 600, color: '#555', textTransform: 'uppercase',
        letterSpacing: '.08em', padding: '8px 10px 4px', flexShrink: 0,
      }}>
        Історія ({steps.length})
      </div>

      {steps.length === 0 && (
        <div style={{ fontSize: 11, color: '#444', padding: '12px 10px' }}>Порожньо</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', padding: '2px 6px 10px' }}>
        {[...steps].reverse().map((step, ri) => {
          const i = steps.length - 1 - ri;
          const isActive  = i === currentIndex;
          const isFuture  = i > currentIndex;
          return (
            <button
              key={i}
              onClick={() => onJump(i)}
              title={`Крок ${i + 1}: ${step.label}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 7,
                padding: '5px 8px', borderRadius: 6,
                border: `1.5px solid ${isActive ? 'var(--primary)' : 'transparent'}`,
                background: isActive ? 'rgba(108,99,255,.15)' : 'transparent',
                color: isActive ? '#fff' : isFuture ? '#444' : '#aaa',
                cursor: 'pointer', textAlign: 'left', width: '100%',
                transition: 'background .12s, border-color .12s',
                textDecoration: isFuture ? 'line-through' : 'none',
              }}
              onMouseEnter={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = BORDER; }}
              onMouseLeave={(e) => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <span style={{
                fontSize: 9, minWidth: 18, textAlign: 'right',
                color: isActive ? 'var(--primary)' : '#555', fontVariantNumeric: 'tabular-nums',
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 12, flexShrink: 0 }}>{step.label.split(' ')[0]}</span>
              <span style={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {step.label.split(' ').slice(1).join(' ')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
