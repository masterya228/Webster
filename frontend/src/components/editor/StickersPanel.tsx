import { useState } from 'react';

export interface Sticker {
  emoji: string;
  label: string;
}

const CATEGORIES: { label: string; stickers: Sticker[] }[] = [
  {
    label: 'Емоції',
    stickers: [
      { emoji: '😀', label: 'Smile' },
      { emoji: '😍', label: 'Love' },
      { emoji: '😎', label: 'Cool' },
      { emoji: '🤩', label: 'Star eyes' },
      { emoji: '😂', label: 'Laugh' },
      { emoji: '🥳', label: 'Party' },
      { emoji: '😢', label: 'Sad' },
      { emoji: '😡', label: 'Angry' },
      { emoji: '🤔', label: 'Think' },
      { emoji: '🥰', label: 'Adore' },
      { emoji: '😴', label: 'Sleep' },
      { emoji: '🤯', label: 'Mind blown' },
    ],
  },
  {
    label: 'Природа',
    stickers: [
      { emoji: '🌸', label: 'Cherry blossom' },
      { emoji: '🌺', label: 'Hibiscus' },
      { emoji: '🌻', label: 'Sunflower' },
      { emoji: '🌈', label: 'Rainbow' },
      { emoji: '⭐', label: 'Star' },
      { emoji: '🌙', label: 'Moon' },
      { emoji: '☀️', label: 'Sun' },
      { emoji: '❄️', label: 'Snowflake' },
      { emoji: '🍀', label: 'Clover' },
      { emoji: '🦋', label: 'Butterfly' },
      { emoji: '🌊', label: 'Wave' },
      { emoji: '🔥', label: 'Fire' },
    ],
  },
  {
    label: 'Об\'єкти',
    stickers: [
      { emoji: '❤️', label: 'Heart' },
      { emoji: '💜', label: 'Purple heart' },
      { emoji: '💛', label: 'Yellow heart' },
      { emoji: '💎', label: 'Diamond' },
      { emoji: '👑', label: 'Crown' },
      { emoji: '🎨', label: 'Palette' },
      { emoji: '🎉', label: 'Party' },
      { emoji: '🎀', label: 'Ribbon' },
      { emoji: '🏆', label: 'Trophy' },
      { emoji: '📸', label: 'Camera' },
      { emoji: '🎵', label: 'Music' },
      { emoji: '✨', label: 'Sparkles' },
    ],
  },
  {
    label: 'Тварини',
    stickers: [
      { emoji: '🐶', label: 'Dog' },
      { emoji: '🐱', label: 'Cat' },
      { emoji: '🦊', label: 'Fox' },
      { emoji: '🐼', label: 'Panda' },
      { emoji: '🦄', label: 'Unicorn' },
      { emoji: '🐸', label: 'Frog' },
      { emoji: '🦁', label: 'Lion' },
      { emoji: '🐧', label: 'Penguin' },
      { emoji: '🦋', label: 'Butterfly' },
      { emoji: '🐙', label: 'Octopus' },
      { emoji: '🦊', label: 'Fox' },
      { emoji: '🐨', label: 'Koala' },
    ],
  },
  {
    label: 'Їжа',
    stickers: [
      { emoji: '🍕', label: 'Pizza' },
      { emoji: '🍔', label: 'Burger' },
      { emoji: '🍩', label: 'Donut' },
      { emoji: '🎂', label: 'Cake' },
      { emoji: '🍦', label: 'Ice cream' },
      { emoji: '🍓', label: 'Strawberry' },
      { emoji: '🍉', label: 'Watermelon' },
      { emoji: '☕', label: 'Coffee' },
      { emoji: '🍺', label: 'Beer' },
      { emoji: '🍭', label: 'Lollipop' },
      { emoji: '🥑', label: 'Avocado' },
      { emoji: '🍪', label: 'Cookie' },
    ],
  },
  {
    label: 'Знаки',
    stickers: [
      { emoji: '✅', label: 'Check' },
      { emoji: '❌', label: 'Cross' },
      { emoji: '⚡', label: 'Lightning' },
      { emoji: '💯', label: '100' },
      { emoji: '🔑', label: 'Key' },
      { emoji: '💡', label: 'Idea' },
      { emoji: '🚀', label: 'Rocket' },
      { emoji: '💪', label: 'Strong' },
      { emoji: '👍', label: 'Like' },
      { emoji: '👏', label: 'Clap' },
      { emoji: '🎯', label: 'Target' },
      { emoji: '🔔', label: 'Bell' },
    ],
  },
];

interface Props {
  onAddSticker: (emoji: string) => void;
  onClose: () => void;
}

const BG     = '#16162a';
const BORDER = '#2d2d45';

export default function StickersPanel({ onAddSticker, onClose }: Props) {
  const [activeCat, setActiveCat] = useState(0);
  const [search, setSearch] = useState('');

  const filtered = search
    ? CATEGORIES.flatMap(c => c.stickers).filter(s => s.label.toLowerCase().includes(search.toLowerCase()) || s.emoji.includes(search))
    : CATEGORIES[activeCat].stickers;

  return (
    <div style={{
      width: 260, background: BG, borderRight: `1px solid ${BORDER}`,
      display: 'flex', flexDirection: 'column', flexShrink: 0, zIndex: 10,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 12px 6px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0,
      }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#ddd' }}>Стікери</span>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#666', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
      </div>

      <div style={{ padding: '8px 10px', borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Пошук стікерів…"
          style={{
            width: '100%', padding: '6px 10px', borderRadius: 6,
            border: `1px solid ${BORDER}`, background: '#1e1e30', color: '#ddd',
            fontSize: 12, outline: 'none', boxSizing: 'border-box',
          }}
        />
      </div>

      {!search && (
        <div style={{ display: 'flex', overflowX: 'auto', borderBottom: `1px solid ${BORDER}`, flexShrink: 0, padding: '4px 6px', gap: 4 }}>
          {CATEGORIES.map((cat, i) => (
            <button key={i} onClick={() => setActiveCat(i)} style={{
              padding: '4px 8px', borderRadius: 6, border: 'none', whiteSpace: 'nowrap',
              background: activeCat === i ? 'var(--primary)' : 'transparent',
              color: activeCat === i ? '#fff' : '#888',
              fontSize: 10, fontWeight: 600, cursor: 'pointer', flexShrink: 0,
            }}>
              {cat.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
          {filtered.map((s, i) => (
            <button key={i} title={s.label} onClick={() => onAddSticker(s.emoji)}
              style={{
                fontSize: 26, background: 'transparent', border: `1px solid transparent`,
                borderRadius: 8, padding: '6px 0', cursor: 'pointer', lineHeight: 1,
                transition: 'background .12s, border-color .12s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2d2d45'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = 'transparent'; }}
            >
              {s.emoji}
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1/-1', textAlign: 'center', color: '#555', fontSize: 12, padding: '20px 0' }}>Не знайдено</div>
          )}
        </div>
      </div>

      <div style={{ padding: '8px 10px', borderTop: `1px solid ${BORDER}`, fontSize: 10, color: '#444', textAlign: 'center' }}>
        Клікніть на стікер щоб додати на полотно
      </div>
    </div>
  );
}
