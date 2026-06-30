import { RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

interface ParallaxOptions {
  /** Total vertical travel in px (element moves from -distance to +distance). */
  distance?: number;
  /** Base scale applied to give a cover background (inset:0) travel headroom. */
  scale?: number;
  /** Element whose viewport passage drives the scrub. Defaults to target's parent. */
  triggerRef?: RefObject<HTMLElement | null>;
}

/**
 * Background parallax via ScrollTrigger scrub — smoother and GPU-friendly,
 * and synced to Lenis through the global ScrollTrigger.update wiring in App.tsx.
 * Replaces the old hand-rolled scroll-listener parallax hooks (useParallax /
 * useParallaxInView). Targets oversized background elements (negative insets),
 * so the ±distance travel never reveals an edge. Respects reduced motion.
 */
export function useScrollParallax(
  targetRef: RefObject<HTMLElement | null>,
  { distance = 100, scale, triggerRef }: ParallaxOptions = {}
) {
  useGSAP(
    () => {
      const target = targetRef.current;
      if (!target) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Scale up cover backgrounds so the ±distance travel never reveals an edge.
      if (scale) gsap.set(target, { scale });

      const trigger = triggerRef?.current ?? target.parentElement ?? target;
      gsap.fromTo(
        target,
        { y: -distance },
        {
          y: distance,
          ease: 'none',
          scrollTrigger: {
            trigger,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    { dependencies: [distance, scale] }
  );
}
