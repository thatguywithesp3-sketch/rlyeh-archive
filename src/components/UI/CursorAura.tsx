import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';

/**
 * A soft green aura that trails the cursor with eased lag — a restrained
 * "something follows you" atmosphere for the archive. Desktop-only (pointer:fine),
 * reduced-motion-gated, and pointer-events:none so it never intercepts clicks.
 * Uses gsap.quickTo for cheap high-frequency updates and the shared 'rlyehGlide'
 * CustomEase (registered in App) for a consistent motion identity.
 */
const Aura = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 420px;
  height: 420px;
  margin: -210px 0 0 -210px; /* center the glow on the pointer */
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  opacity: 0;
  background: radial-gradient(
    circle,
    rgba(0, 255, 136, 0.09) 0%,
    rgba(0, 255, 136, 0.045) 32%,
    transparent 68%
  );
  mix-blend-mode: screen;
  will-change: transform, opacity;
`;

export const CursorAura: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return; // no aura on touch / reduced-motion

    // quickTo setters are created lazily on the first move, so this never
    // depends on ref.current being populated at effect-attach time (which is
    // unreliable under StrictMode's mount/cleanup/remount cycle).
    let xTo: ((v: number) => void) | null = null;
    let yTo: ((v: number) => void) | null = null;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      if (!xTo) {
        xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'rlyehGlide' });
        yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'rlyehGlide' });
      }
      xTo(e.clientX);
      yTo!(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { opacity: 1, duration: 0.6, overwrite: 'auto' });
      }
    };
    const onLeave = () => {
      shown = false;
      if (ref.current) gsap.to(ref.current, { opacity: 0, duration: 0.45, overwrite: 'auto' });
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      if (ref.current) gsap.killTweensOf(ref.current);
    };
  }, []);

  return <Aura ref={ref} aria-hidden="true" />;
};
