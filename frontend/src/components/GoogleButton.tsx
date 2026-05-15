interface GoogleButtonProps {
  label?: string;
}

export default function GoogleButton({ label = 'Continue with Google' }: GoogleButtonProps) {
  const handleClick = () => {
    const base = import.meta.env.VITE_API_URL
      ? import.meta.env.VITE_API_URL.replace(/\/api$/, '')
      : '';
    window.location.href = `${base}/api/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: '11px 16px',
        borderRadius: 'var(--radius-sm)',
        border: '1.5px solid var(--border)',
        background: 'var(--surface)',
        color: 'var(--text)',
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'var(--transition)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = '#4285f4';
        (e.currentTarget as HTMLElement).style.background = '#f8f9ff';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLElement).style.background = 'var(--surface)';
      }}
    >
      <svg width="18" height="18" viewBox="0 0 48 48">
        <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/>
        <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.9-6c-2.1 1.4-4.8 2.3-8 2.3-6.1 0-11.3-4.1-13.2-9.7H2.6v6.2C6.6 42.7 14.7 48 24 48z"/>
        <path fill="#FBBC05" d="M10.8 28.8A14.5 14.5 0 0 1 10.8 19.2v-6.2H2.6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l8.2-6z"/>
        <path fill="#EA4335" d="M24 9.5c3.4 0 6.5 1.2 8.9 3.5l6.7-6.7C35.9 2.4 30.5 0 24 0 14.7 0 6.6 5.3 2.6 13.2l8.2 6C12.7 13.6 17.9 9.5 24 9.5z"/>
      </svg>
      {label}
    </button>
  );
}
