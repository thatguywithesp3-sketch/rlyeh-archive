import { useEffect, useState, RefObject } from 'react';

/**
 * Паралакс offset відносно елемента: фон рухається при скролі в межах секції,
 * не виїжджає за межі (на відміну від useParallax з глобальним scrollY).
 */
export const useParallaxInView = (ref: RefObject<HTMLElement | null>, speed: number = 0.35) => {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const scrollY = window.scrollY;
        const rect = ref.current.getBoundingClientRect();
        const elementTop = rect.top + scrollY;
        setOffset((scrollY - elementTop) * speed);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);

  return offset;
};
