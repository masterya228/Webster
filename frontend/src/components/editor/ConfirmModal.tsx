interface Props {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const BG      = '#24243e';
const BORDER  = '#38385a';
const TEXT    = '#e0e0f4';
const MUTED   = '#8888aa';
const PRIMARY = '#6c63ff';
const DANGER  = '#ef4444';

export default function ConfirmModal({
  title, message, confirmLabel = 'Підтвердити', cancelLabel = 'Скасувати',
  danger = false, onConfirm, onCancel,
}: Props) {
  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
      onMouseDown={e => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div
        className="card fade-in"
        style={{
          background: BG, border: `1px solid ${BORDER}`, borderRadius: 14,
          padding: '24px 28px', maxWidth: 400, width: '100%',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        <div style={{ fontSize: 15, fontWeight: 700, color: TEXT, marginBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 13, color: MUTED, lineHeight: 1.6, marginBottom: 22, whiteSpace: 'pre-wrap' }}>{message}</div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px', borderRadius: 8, border: `1px solid ${BORDER}`,
              background: 'transparent', color: MUTED, cursor: 'pointer', fontSize: 13, fontWeight: 500,
            }}
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px', borderRadius: 8, border: 'none',
              background: danger ? DANGER : PRIMARY, color: '#fff',
              cursor: 'pointer', fontSize: 13, fontWeight: 600,
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
