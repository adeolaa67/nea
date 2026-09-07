import { useMemo } from 'react';

const LEAF_HUES = [
  ['#7a3a12', '#a85a1f'],
  ['#8c4a1a', '#c17a2e'],
  ['#6b3410', '#9a5620'],
  ['#a2621f', '#d68a3a'],
  ['#5e3313', '#8a5423']
];

// Purely decorative animated particles layered over a section background.
// variant="leaf" draws a realistic brown autumn-leaf shape in CSS (no emoji);
// variant="emoji" (default) renders the supplied emoji glyphs, e.g. cherry
// blossom petals on the About page. aria-hidden since they carry no content.
export default function FallingParticles({ emojis, count = 16, className = '', variant = 'emoji' }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: emojis ? emojis[i % emojis.length] : null,
      hue: LEAF_HUES[i % LEAF_HUES.length],
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 7 + Math.random() * 8,
      size: 0.9 + Math.random() * 1.2,
      drift: Math.round((Math.random() * 2 - 1) * 70),
      spin: Math.random() > 0.5 ? 360 : -360
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, variant]);

  return (
    <div className={`cc-falling ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className={`cc-falling__item ${variant === 'leaf' ? 'cc-falling__item--leaf' : ''}`}
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            fontSize: `${p.size}rem`,
            '--cc-drift': `${p.drift}px`,
            '--cc-spin': `${p.spin}deg`
          }}
        >
          {variant === 'leaf' ? (
            <span
              className="cc-leaf"
              style={{
                width: `${p.size * 14}px`,
                height: `${p.size * 14}px`,
                background: `linear-gradient(135deg, ${p.hue[1]}, ${p.hue[0]})`
              }}
            >
              <span className="cc-leaf__vein" />
            </span>
          ) : (
            p.emoji
          )}
        </span>
      ))}
    </div>
  );
}
