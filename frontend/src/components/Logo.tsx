interface LogoProps {
  size?: number;
  textSize?: number;
  light?: boolean;
}

export function LogoMark({ size = 32 }: { size?: number }) {
  const id = `lg${size}`;
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#5b52e8"/>
          <stop offset="100%" stopColor="#c026d3"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${id})`}/>
      <path d="M16 4 L28 16 L16 28 L4 16 Z" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4"/>
      <path d="M16 9 L23 16 L16 23 L9 16 Z" fill="rgba(255,255,255,0.32)"/>
      <circle cx="16" cy="16" r="4.5" fill="#fff"/>
    </svg>
  );
}

export function LogoName({ size = 20, light = false }: { size?: number; light?: boolean }) {
  return (
    <span style={{
      fontSize: size,
      fontWeight: 700,
      letterSpacing: '-0.3px',
      background: light ? 'none' : 'linear-gradient(90deg, #5b52e8, #c026d3)',
      WebkitBackgroundClip: light ? 'unset' : 'text',
      WebkitTextFillColor: light ? '#fff' : 'transparent',
      color: light ? '#fff' : undefined,
      fontFamily: 'Inter, sans-serif',
    }}>
      Vizora
    </span>
  );
}

export default function Logo({ size = 32, textSize = 20, light = false }: LogoProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <LogoMark size={size} />
      <LogoName size={textSize} light={light} />
    </div>
  );
}
