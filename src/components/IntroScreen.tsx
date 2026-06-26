import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';

/* ─── Slide images ─── */
const PUBLIC = process.env.PUBLIC_URL || '';
const SLIDES = [
  `${PUBLIC}/Images/Slide 1.png`,
  `${PUBLIC}/Images/Slide 2.png`,
  `${PUBLIC}/Images/Slide 3.jpg`,
  `${PUBLIC}/Images/Slide 4.png`,
  `${PUBLIC}/Images/Slide 5.png`,
  `${PUBLIC}/Images/Slide 6.png`,
  `${PUBLIC}/Images/Slide 7.webp`,
];

/* ─── Elder Sign path data ─── */
const ELDER_SIGN_PATH =
  'M0 0C18.58 45.12 61.47 112.66 98.53 154.78L102.59 139.59C84.95 117.42 67.49 85.88 57.22 60.9C87.08 75.5 136.36 89.61 148.66 92.69C190.08 103.89 249.86 113.15 293.56 115.5C304.95 127.67 310.42 140.38 317.41 151.97L326.41 144.34C319.6 135.33 306.25 114.75 290.78 95.87C274.66 75.39 238.71 34.02 198.78 5.81003C177.2 30.72 165.4 45.48 149.03 74.4L170.59 78.44C174.67 71.09 179.47 63.36 184.25 56.22L196.22 60.81L193.53 43.22C194.72 41.65 195.95 39.95 197.06 38.59C231.22 56.46 261.46 80.31 284.66 104.15C198.54 104.46 85.55 70.98 0 0ZM77.25 81.56L99.84 118.15L109.59 114.5L77.25 81.56ZM491.25 94.19C421.4 99.6 396.2 107.36 318.03 107.37L323.5 115.62C346.24 118.77 369.87 121.89 388.56 123.12C371.31 133.47 337.93 154.38 323.72 162.81C298.41 177.32 253.58 204.52 218.5 234.34C186.53 217.06 161.94 194.62 133.41 171.06L131.06 181.69C158.37 215.48 202.58 249.05 256.5 283.78C310.66 317.51 374.7 340.22 423.06 345.65C399.26 277.49 380.34 225.66 356.53 178.15L337.19 185.47C357 226.66 376.35 266.57 388.66 306.84C374.41 306.09 355.72 299.97 339.22 295C354.71 305.01 367.27 309.14 377.94 315.59C352.06 311.1 307.36 292.29 282.28 276.59L327.44 290.69C307.46 278.85 291.62 269.3 272.41 254.44C269.13 256.98 265.95 260.49 262.59 265.31C255.53 263 233.06 244.45 228.66 241.56C261.86 214.73 293.04 193.37 325.31 175.75C356.87 158.23 430.89 120.85 491.25 94.19ZM136.47 98.03C128.48 110.45 113.91 149.41 107.09 168.12C88.87 217.53 77.83 311.4 87.72 384.06C91.07 384.95 98.08 390.71 101.44 391.59C137.82 341.08 164.54 304.01 201.44 268.59L188.28 257.15C164.23 277.13 132.45 308.9 106.22 340.72C104.73 323.13 106.73 301.17 109.22 283.09C103.58 290.06 97.94 304.5 95.28 312.97C94.62 292.22 98.43 271.97 102.25 252.22C105.06 257.26 108.53 260.94 111.5 264.72C110.78 240.62 116.72 175.27 119.91 163.34C124.41 145.04 135.42 121.5 143.56 103.4L136.47 98.03ZM206.59 110.84C213.77 121.91 217.46 140.47 211.47 151.69C208.72 156.61 208.74 161.52 210.75 166.15L221.22 154.75L216.66 174.44C220.95 178.76 226.77 182.64 233.41 185.84C232.99 177.45 229.62 174.19 236.47 166.94C242.1 161.47 252.95 157.31 237.06 145.59C232.51 142.1 229.46 133.08 226.72 127.9C220.42 115.42 212.07 112.72 206.59 110.84ZM256.59 126.34C249.76 126.46 243.01 126.9 237.22 127.31L239.88 134.94C250.94 133.85 284.77 136.91 283.56 145C282.46 152.96 254.76 168.4 238.91 171.65L239.66 176.69C259.58 172.82 299.03 154.59 298.81 142.53C298.57 128.4 277.11 125.99 256.59 126.34ZM204.75 134.62C184.83 138.49 142.21 152.44 142.53 164.5C142.85 176.02 184 178.93 204.13 179.75L200.25 169.69C189.19 170.78 157.69 165.92 157.78 162.06C157.89 157.79 189.64 142.91 205.5 139.65L204.75 134.62ZM151.06 237.09L143.75 237.69L143.13 262.72L151.06 237.09ZM347.47 237.69C344.22 239.31 340.97 240.93 337.72 242.56C354.19 257.4 364.55 272.25 377.97 287.09C370.24 270.62 355.81 248.05 347.47 237.69ZM307.22 245.03C304.17 248.28 301.11 251.53 298.06 254.78C319 261.69 341.17 274.69 359.06 284.65C346.05 272.66 326.33 255.8 307.22 245.03Z';

/* ─── Timing constants (ms) ─── */
const SLIDE_INTERVAL = 4000;       // Time each slide is visible
const SLIDE_CROSSFADE = 2000;      // Crossfade duration
const STROKE_DURATION = 5000;      // SVG stroke draw duration
const STROKE_DELAY = 800;          // Delay before stroke starts
const GLOW_DELAY = 500;            // Delay after stroke before glow
const EXIT_DELAY = 1500;           // Hold after glow before exit
const EXIT_DURATION = 1800;        // Exit animation duration

/* ─── Animations ─── */

const breathe = keyframes`
  0%, 100% { opacity: 0.35; filter: blur(18px); }
  50%      { opacity: 0.55; filter: blur(22px); }
`;

/* ─── Styled components ─── */

const Overlay = styled.div<{ $phase: 'active' | 'exiting' | 'done' }>`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000000;
  pointer-events: ${p => (p.$phase === 'done' ? 'none' : 'all')};
  opacity: ${p => (p.$phase === 'exiting' || p.$phase === 'done' ? 0 : 1)};
  transition: opacity ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1);

  ${p => p.$phase === 'done' && css`
    visibility: hidden;
  `}
`;

/* Background slide layers — all stacked, only opacity changes */
const SlideLayer = styled.div<{ $url: string; $active: boolean }>`
  position: absolute;
  inset: 0;
  background-image: url('${p => p.$url}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: ${p => (p.$active ? 0.45 : 0)};
  transition: opacity ${SLIDE_CROSSFADE}ms ease-in-out;
  will-change: opacity;
`;

/* Dark overlay on top of slides */
const DarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(0, 0, 0, 0.75) 50%,
    rgba(0, 0, 0, 0.9) 100%
  );
  pointer-events: none;
`;

/* SVG container — centered, moves up on exit */
const SigilContainer = styled.div<{ $phase: 'active' | 'exiting' | 'done' }>`
  position: relative;
  z-index: 2;
  width: min(320px, 60vw);
  height: min(260px, 50vw);
  display: flex;
  align-items: center;
  justify-content: center;
  transform: ${p => (p.$phase === 'exiting' || p.$phase === 'done'
    ? 'translateY(-40vh) scale(0.6)'
    : 'translateY(0) scale(1)')};
  opacity: ${p => (p.$phase === 'exiting' || p.$phase === 'done' ? 0 : 1)};
  transition:
    transform ${EXIT_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1),
    opacity ${EXIT_DURATION * 0.7}ms cubic-bezier(0.4, 0, 0.2, 1);
`;

/* Central glow — appears after stroke animation completes */
const CenterGlow = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 255, 136, 0.4) 0%,
    rgba(0, 255, 136, 0.15) 40%,
    transparent 70%
  );
  opacity: ${p => (p.$active ? 1 : 0)};
  transition: opacity 1.5s ease-in-out;
  animation: ${p => (p.$active ? css`${breathe} 4s ease-in-out infinite` : 'none')};
  pointer-events: none;
`;

/* ─── Component ─── */

interface IntroScreenProps {
  onComplete: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const [activeSlide, setActiveSlide] = useState(0);
  const [strokeDone, setStrokeDone] = useState(false);
  const [glowActive, setGlowActive] = useState(false);
  const [phase, setPhase] = useState<'active' | 'exiting' | 'done'>('active');

  /* ─── Background slideshow ─── */
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % SLIDES.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  /* ─── SVG stroke animation via requestAnimationFrame ─── */
  const animateStroke = useCallback(() => {
    const path = pathRef.current;
    if (!path) return;

    const totalLength = path.getTotalLength();

    // Initial state: fully hidden stroke
    path.style.strokeDasharray = `${totalLength}`;
    path.style.strokeDashoffset = `${totalLength}`;
    path.style.opacity = '1';

    const startAnimation = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / STROKE_DURATION, 1);

      // Cinematic easing: ease-in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      const offset = totalLength * (1 - eased);
      path.style.strokeDashoffset = `${offset}`;

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(startAnimation);
      } else {
        // Stroke complete
        setStrokeDone(true);
      }
    };

    // Delay before stroke begins
    const delayTimeout = setTimeout(() => {
      startTimeRef.current = 0;
      rafRef.current = requestAnimationFrame(startAnimation);
    }, STROKE_DELAY);

    return () => {
      clearTimeout(delayTimeout);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const cleanup = animateStroke();
    return cleanup;
  }, [animateStroke]);

  /* ─── Glow activation after stroke completes ─── */
  useEffect(() => {
    if (!strokeDone) return;

    const glowTimeout = setTimeout(() => {
      setGlowActive(true);
    }, GLOW_DELAY);

    return () => clearTimeout(glowTimeout);
  }, [strokeDone]);

  /* ─── Exit sequence after glow ─── */
  useEffect(() => {
    if (!glowActive) return;

    const exitTimeout = setTimeout(() => {
      setPhase('exiting');
    }, EXIT_DELAY);

    return () => clearTimeout(exitTimeout);
  }, [glowActive]);

  /* ─── Final cleanup: mark done after exit transition ─── */
  useEffect(() => {
    if (phase !== 'exiting') return;

    const doneTimeout = setTimeout(() => {
      setPhase('done');
      onComplete();
    }, EXIT_DURATION);

    return () => clearTimeout(doneTimeout);
  }, [phase, onComplete]);

  if (phase === 'done') return null;

  return (
    <Overlay $phase={phase}>
      {/* Background slideshow */}
      {SLIDES.map((url, i) => (
        <SlideLayer key={i} $url={url} $active={i === activeSlide} />
      ))}
      <DarkOverlay />

      {/* Central sigil */}
      <SigilContainer $phase={phase}>
        <CenterGlow $active={glowActive} />
        <svg
          viewBox="0 0 492 392"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%', overflow: 'visible' }}
        >
          {/* Fill layer — fades in after stroke completes */}
          <path
            d={ELDER_SIGN_PATH}
            fill="#00FF88"
            fillRule="evenodd"
            clipRule="evenodd"
            style={{
              opacity: strokeDone ? 0.15 : 0,
              transition: 'opacity 1.5s ease-in-out',
            }}
          />
          {/* Stroke layer — animated via dashoffset */}
          <path
            ref={pathRef}
            d={ELDER_SIGN_PATH}
            fill="none"
            stroke="#00FF88"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0 }}
            filter={strokeDone ? 'url(#sigil-glow)' : undefined}
          />
          {/* SVG glow filter */}
          <defs>
            <filter id="sigil-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
      </SigilContainer>
    </Overlay>
  );
};
