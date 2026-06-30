import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { HeroSection } from './HeroSection';
import { AboutCthulhu } from '../Sections/AboutCthulhu';

const HERO_VIDEO_URL = `${process.env.PUBLIC_URL || ''}/videos/hero-background.mp4`;

const Wrapper = styled.section`
  position: relative;
  overflow: hidden;
  background: #000000;
`;

const BackgroundVideo = styled.video`
  position: absolute;
  inset: -30px;
  z-index: 0;
  width: calc(100% + 60px);
  height: calc(100% + 60px);
  object-fit: cover;
  object-position: center;
  transform: scale(1.02);
  filter: brightness(1) saturate(1);
  transition: filter 0.5s ease-out;
`;

const FallbackImage = styled.div`
  position: absolute;
  inset: -30px;
  z-index: 0;
  background-image: url('${process.env.PUBLIC_URL || ''}/Images/ctulhu-hero-bg.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: scale(1.02);
`;

const SharedOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  box-shadow: inset 0 0 20vmin 6vmin rgba(0, 0, 0, 0.35);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(circle at 30% 30%, rgba(0, 255, 136, 0.1) 0%, transparent 70%),
      radial-gradient(circle at 70% 70%, rgba(0, 212, 255, 0.08) 0%, transparent 70%),
      radial-gradient(circle at 50% 50%, rgba(123, 44, 191, 0.05) 0%, transparent 70%);
    animation: breathe 8s ease-in-out infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.4;
  }
  
  @keyframes breathe {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.05); opacity: 0.9; }
  }
`;

const HeroTitleBackdrop = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(95vw, 1000px);
  height: min(80vh, 580px);
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.6) 0%,
    rgba(0, 0, 0, 0.28) 45%,
    rgba(0, 0, 0, 0.1) 70%,
    transparent 100%
  );
  filter: blur(20px);
  -webkit-filter: blur(20px);
`;

const TopGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 55%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 25%,
    rgba(0, 0, 0, 0.7) 55%,
    #000000 100%
  );
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(0, 0, 0, 0.3) 25%,
    rgba(0, 0, 0, 0.7) 55%,
    #000000 100%
  );
`;

export const HeroAboutSection: React.FC = () => {
  const wrapperRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleError = () => setVideoError(true);
    const handleCanPlay = () => {
      video.play().catch(() => setVideoError(true));
    };

    video.addEventListener('error', handleError);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('error', handleError);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, []);

  return (
    <Wrapper ref={wrapperRef}>
      {!videoError ? (
        <BackgroundVideo
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster={`${process.env.PUBLIC_URL || ''}/Images/ctulhu-hero-bg.webp`}
          aria-hidden="true"
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </BackgroundVideo>
      ) : (
        <FallbackImage aria-hidden="true" />
      )}
      <SharedOverlay aria-hidden />
      <TopGradient aria-hidden />
      <HeroTitleBackdrop aria-hidden />
      <BottomGradient aria-hidden />
      <HeroSection embedded />
      <AboutCthulhu transparentBg />
    </Wrapper>
  );
};
