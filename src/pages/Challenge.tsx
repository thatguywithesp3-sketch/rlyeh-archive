import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useIntersection } from '../hooks/useIntersection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

/* ─── Elder Sign SVG path (from public/elder sign.svg) ─── */
const ELDER_SIGN_PATH =
  'M0 0C18.58 45.12 61.47 112.66 98.53 154.78L102.59 139.59C84.95 117.42 67.49 85.88 57.22 60.9C87.08 75.5 136.36 89.61 148.66 92.69C190.08 103.89 249.86 113.15 293.56 115.5C304.95 127.67 310.42 140.38 317.41 151.97L326.41 144.34C319.6 135.33 306.25 114.75 290.78 95.87C274.66 75.39 238.71 34.02 198.78 5.81003C177.2 30.72 165.4 45.48 149.03 74.4L170.59 78.44C174.67 71.09 179.47 63.36 184.25 56.22L196.22 60.81L193.53 43.22C194.72 41.65 195.95 39.95 197.06 38.59C231.22 56.46 261.46 80.31 284.66 104.15C198.54 104.46 85.55 70.98 0 0ZM77.25 81.56L99.84 118.15L109.59 114.5L77.25 81.56ZM491.25 94.19C421.4 99.6 396.2 107.36 318.03 107.37L323.5 115.62C346.24 118.77 369.87 121.89 388.56 123.12C371.31 133.47 337.93 154.38 323.72 162.81C298.41 177.32 253.58 204.52 218.5 234.34C186.53 217.06 161.94 194.62 133.41 171.06L131.06 181.69C158.37 215.48 202.58 249.05 256.5 283.78C310.66 317.51 374.7 340.22 423.06 345.65C399.26 277.49 380.34 225.66 356.53 178.15L337.19 185.47C357 226.66 376.35 266.57 388.66 306.84C374.41 306.09 355.72 299.97 339.22 295C354.71 305.01 367.27 309.14 377.94 315.59C352.06 311.1 307.36 292.29 282.28 276.59L327.44 290.69C307.46 278.85 291.62 269.3 272.41 254.44C269.13 256.98 265.95 260.49 262.59 265.31C255.53 263 233.06 244.45 228.66 241.56C261.86 214.73 293.04 193.37 325.31 175.75C356.87 158.23 430.89 120.85 491.25 94.19ZM136.47 98.03C128.48 110.45 113.91 149.41 107.09 168.12C88.87 217.53 77.83 311.4 87.72 384.06C91.07 384.95 98.08 390.71 101.44 391.59C137.82 341.08 164.54 304.01 201.44 268.59L188.28 257.15C164.23 277.13 132.45 308.9 106.22 340.72C104.73 323.13 106.73 301.17 109.22 283.09C103.58 290.06 97.94 304.5 95.28 312.97C94.62 292.22 98.43 271.97 102.25 252.22C105.06 257.26 108.53 260.94 111.5 264.72C110.78 240.62 116.72 175.27 119.91 163.34C124.41 145.04 135.42 121.5 143.56 103.4L136.47 98.03ZM206.59 110.84C213.77 121.91 217.46 140.47 211.47 151.69C208.72 156.61 208.74 161.52 210.75 166.15L221.22 154.75L216.66 174.44C220.95 178.76 226.77 182.64 233.41 185.84C232.99 177.45 229.62 174.19 236.47 166.94C242.1 161.47 252.95 157.31 237.06 145.59C232.51 142.1 229.46 133.08 226.72 127.9C220.42 115.42 212.07 112.72 206.59 110.84ZM256.59 126.34C249.76 126.46 243.01 126.9 237.22 127.31L239.88 134.94C250.94 133.85 284.77 136.91 283.56 145C282.46 152.96 254.76 168.4 238.91 171.65L239.66 176.69C259.58 172.82 299.03 154.59 298.81 142.53C298.57 128.4 277.11 125.99 256.59 126.34ZM204.75 134.62C184.83 138.49 142.21 152.44 142.53 164.5C142.85 176.02 184 178.93 204.13 179.75L200.25 169.69C189.19 170.78 157.69 165.92 157.78 162.06C157.89 157.79 189.64 142.91 205.5 139.65L204.75 134.62ZM151.06 237.09L143.75 237.69L143.13 262.72L151.06 237.09ZM347.47 237.69C344.22 239.31 340.97 240.93 337.72 242.56C354.19 257.4 364.55 272.25 377.97 287.09C370.24 270.62 355.81 248.05 347.47 237.69ZM307.22 245.03C304.17 248.28 301.11 251.53 298.06 254.78C319 261.69 341.17 274.69 359.06 284.65C346.05 272.66 326.33 255.8 307.22 245.03Z';

/* ─── Ritual phrases revealed step-by-step ─── */
const RITUAL_STEPS = [
  {
    phrase: 'Ph\'nglui mglw\'nafh',
    meaning: 'In his house...',
    instruction: 'Trace the first sigil to begin.',
  },
  {
    phrase: 'Cthulhu R\'lyeh',
    meaning: '...at R\'lyeh...',
    instruction: 'The seal responds. Continue.',
  },
  {
    phrase: 'wgah\'nagl fhtagn',
    meaning: '...dead Cthulhu waits dreaming.',
    instruction: 'The final ward. Speak it.',
  },
];

/* ─── Animations ─── */

const slowRotate = keyframes`
  0%   { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const subtlePulse = keyframes`
  0%, 100% { opacity: 0.12; }
  50%      { opacity: 0.2; }
`;

/* ─── Layout ─── */

const Page = styled.div`
  min-height: 100vh;
  background: #000000;
  position: relative;
  padding-bottom: 100px;
`;

/* ─── Hero / Intro ─── */

const IntroSection = styled.section`
  padding: clamp(140px, 20vh, 240px) 16px clamp(40px, 6vh, 80px);
  text-align: center;
  position: relative;
  z-index: 1;
`;

const IntroTitle = styled.h1<{ $visible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(3rem, 12vw, 8rem);
  line-height: 1.1;
  margin: 0 0 24px;
  background: linear-gradient(
    to bottom,
    #FFFFFF 0%,
    rgba(255, 255, 255, 0.95) 15%,
    rgba(200, 200, 200, 0.7) 35%,
    rgba(120, 120, 120, 0.35) 55%,
    rgba(60, 60, 60, 0.1) 75%,
    transparent 90%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: ${p => (p.$visible ? 1 : 0)};
  filter: ${p => (p.$visible ? 'blur(0)' : 'blur(20px)')};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 1.5s ease-out;
`;

const IntroText = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: clamp(1rem, 2vw, 1.25rem);
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.5);
  max-width: 520px;
  margin: 0 auto;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(16px)')};
  transition: all 1.2s ease-out 0.3s;
`;

/* ─── Ritual zone ─── */

const RitualSection = styled.section`
  position: relative;
  padding: 60px 16px 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1;
`;

/* The central sigil — the elder sign */
const SigilContainer = styled.div`
  position: relative;
  width: min(400px, 80vw);
  height: min(400px, 80vw);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 60px;
`;

/* Slow-rotating outer ring */
const OuterRing = styled.div`
  position: absolute;
  inset: -20px;
  border: 1px solid rgba(0, 255, 136, 0.1);
  border-radius: 50%;
  animation: ${slowRotate} 120s linear infinite;
`;

/* Subtle pulsing glow behind the sigil */
const SigilGlow = styled.div<{ $intensity: number }>`
  position: absolute;
  inset: 10%;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(0, 255, 136, ${p => 0.06 + p.$intensity * 0.12}) 0%,
    transparent 70%
  );
  animation: ${subtlePulse} 6s ease-in-out infinite;
  transition: all 2s ease-in-out;
  pointer-events: none;
`;

/* The clickable SVG sigil */
const SigilSvg = styled.svg<{ $active: boolean }>`
  width: 65%;
  height: 65%;
  cursor: pointer;
  transition: filter 1.5s ease-in-out, opacity 1.5s ease-in-out;
  opacity: ${p => (p.$active ? 1 : 0.35)};
  filter: ${p =>
    p.$active
      ? 'drop-shadow(0 0 20px rgba(0, 255, 136, 0.5))'
      : 'drop-shadow(0 0 4px rgba(0, 255, 136, 0.15))'};

  &:hover {
    opacity: ${p => (p.$active ? 1 : 0.55)};
    filter: drop-shadow(0 0 12px rgba(0, 255, 136, 0.35));
  }

  path {
    fill: #00FF88;
    transition: fill 1.5s ease-in-out;
  }
`;

/* Progress indicator — small dots below the sigil */
const ProgressDots = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 48px;
`;

const Dot = styled.div<{ $filled: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${p => (p.$filled ? '#00FF88' : 'rgba(255, 255, 255, 0.15)')};
  transition: background 1s ease-in-out, box-shadow 1s ease-in-out;
  box-shadow: ${p => (p.$filled ? '0 0 8px rgba(0, 255, 136, 0.5)' : 'none')};
`;

/* Ritual text area */
const RitualTextZone = styled.div`
  text-align: center;
  max-width: 480px;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const RitualPhrase = styled.p<{ $visible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 700;
  color: #00FF88;
  margin: 0 0 12px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  filter: ${p => (p.$visible ? 'blur(0)' : 'blur(12px)')};
  transition: all 1.2s ease-in-out;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.3);
`;

const RitualMeaning = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 20px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 1s ease-in-out 0.4s;
`;

const RitualInstruction = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.35);
  margin: 0;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 0.8s ease-in-out 0.2s;
`;

/* Final state — the full incantation revealed */
const FinalReveal = styled.div<{ $visible: boolean }>`
  text-align: center;
  max-width: 600px;
  margin-top: 40px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 1.5s ease-in-out;
`;

const FinalPhrase = styled.p`
  font-family: 'UnifrakturCook', serif;
  font-size: clamp(1.25rem, 3vw, 1.75rem);
  font-weight: 700;
  color: #00FF88;
  margin: 0 0 16px;
  letter-spacing: 0.02em;
  text-shadow: 0 0 30px rgba(0, 255, 136, 0.4);
`;

const FinalMeaning = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin: 0;
`;

const WarningLine = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  color: #FF006E;
  margin-top: 48px;
  text-shadow: 0 0 20px rgba(255, 0, 110, 0.5);
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 2s ease-in-out 1s;
`;

/* ─── Component ─── */

const Challenge: React.FC = () => {
  useDocumentMeta({
    title: "The Challenge — R'LYEH ARCHIVE",
    description:
      'Trace the Elder Sign and speak the ritual. A step-by-step invocation drawn from the cult materials held in the archive. Proceed at your own risk.',
  });

  const { ref: introRef, isIntersecting: introVisible } = useIntersection({ threshold: 0.1 });
  const [step, setStep] = useState(-1); // -1 = not started
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isComplete = step >= RITUAL_STEPS.length;
  const currentStep = step >= 0 && step < RITUAL_STEPS.length ? RITUAL_STEPS[step] : null;

  /* Cleanup timeout on unmount */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  /* Advance the ritual — slow, deliberate pace */
  const handleSigilClick = useCallback(() => {
    if (transitioning || isComplete) return;

    setTransitioning(true);

    // Brief pause before revealing next step (ritual weight)
    timeoutRef.current = setTimeout(() => {
      setStep(prev => prev + 1);
      setTransitioning(false);
    }, 800);
  }, [transitioning, isComplete]);

  return (
    <Page>
      <Header />

      {/* Intro / framing */}
      <IntroSection ref={introRef}>
        <IntroTitle $visible={introVisible}>The Challenge</IntroTitle>
        <IntroText $visible={introVisible}>
          Some thresholds, once crossed, cannot be uncrossed.
          Proceed only if you accept what may follow.
        </IntroText>
      </IntroSection>

      {/* Core ritual zone */}
      <RitualSection>
        {/* Central sigil */}
        <SigilContainer>
          <OuterRing />
          <SigilGlow $intensity={isComplete ? 1 : (step + 1) / RITUAL_STEPS.length} />
          <SigilSvg
            viewBox="0 0 492 392"
            xmlns="http://www.w3.org/2000/svg"
            $active={step >= 0}
            onClick={handleSigilClick}
            role="button"
            aria-label="Activate the sigil"
          >
            <path fillRule="evenodd" clipRule="evenodd" d={ELDER_SIGN_PATH} />
          </SigilSvg>
        </SigilContainer>

        {/* Progress dots */}
        <ProgressDots>
          {RITUAL_STEPS.map((_, i) => (
            <Dot key={i} $filled={step > i || isComplete} />
          ))}
        </ProgressDots>

        {/* Current step text */}
        {!isComplete && (
          <RitualTextZone>
            {step === -1 ? (
              <RitualInstruction $visible>
                Touch the sigil to begin the rite.
              </RitualInstruction>
            ) : (
              currentStep && (
                <>
                  <RitualPhrase $visible={!transitioning}>
                    {currentStep.phrase}
                  </RitualPhrase>
                  <RitualMeaning $visible={!transitioning}>
                    {currentStep.meaning}
                  </RitualMeaning>
                  <RitualInstruction $visible={!transitioning}>
                    {currentStep.instruction}
                  </RitualInstruction>
                </>
              )
            )}
          </RitualTextZone>
        )}

        {/* Final reveal */}
        {isComplete && (
          <FinalReveal $visible>
            <FinalPhrase>
              Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn
            </FinalPhrase>
            <FinalMeaning>
              In his house at R'lyeh, dead Cthulhu waits dreaming.
              The rite is complete. You have spoken the words.
              What answers may come, you alone must bear.
            </FinalMeaning>
            <WarningLine $visible>
              ⚠ The archive has recorded your interaction.
            </WarningLine>
          </FinalReveal>
        )}
      </RitualSection>

      <Footer />
    </Page>
  );
};

export default Challenge;
