interface Props { size?: number; }

export default function DefaultAvatar({ size = 36 }: Props) {
  const r = size / 2;
  const headCy = size * 0.35;
  const headR  = size * 0.22;
  const bodyY1 = size * 0.60;
  const bodyX0 = size * 0.04;
  const bodyX1 = size * 0.96;
  const bodyY2 = size * 1.04;

  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: 'linear-gradient(135deg, #ede9ff 0%, #ddd6fe 100%)',
      border: `${Math.max(2, size * 0.055)}px solid #6c63ff`,
      overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'flex-end',
    }}>
      <svg
        width={size} height={size}
        viewBox={`0 0 ${size} ${size}`}
        xmlns="http://www.w3.org/2000/svg"
        style={{ display: 'block' }}
      >
        <circle cx={r} cy={headCy} r={headR} fill="#6c63ff"/>
        <path
          d={`M${bodyX0} ${bodyY2} C${bodyX0} ${bodyY1} ${size*0.25} ${bodyY1*0.92} ${r} ${bodyY1*0.92} C${size*0.75} ${bodyY1*0.92} ${bodyX1} ${bodyY1} ${bodyX1} ${bodyY2} Z`}
          fill="#6c63ff"
        />
      </svg>
    </div>
  );
}
