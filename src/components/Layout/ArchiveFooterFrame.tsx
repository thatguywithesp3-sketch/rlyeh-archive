import React from 'react';
import styled from 'styled-components';
import { useParallax } from '../../hooks/useParallax';
import { ArchiveSection } from '../Sections/Archive';
import { Footer } from './Footer';

const FRAME_BG_URL = `${process.env.PUBLIC_URL || ''}/Images/archive_hero_bg.png`;

const FrameWrapper = styled.section`
  position: relative;
  overflow-x: hidden;
  overflow-y: visible;
  isolation: isolate;
  min-height: 100vh;
  background-color: transparent;
`;

const BackgroundLayer = styled.div.attrs<{ $offset: number }>((props) => ({
  style: {
    transform: `translateY(${props.$offset}px)`,
  },
}))<{ $offset: number }>`
  position: absolute;
  top: -200px;
  left: 0;
  right: 0;
  bottom: -200px;
  z-index: 0;
  background-image: url('${FRAME_BG_URL}') !important;
  background-size: cover !important;
  background-position: center !important;
  background-repeat: no-repeat !important;
  background-color: transparent !important;
  will-change: transform;
  pointer-events: none;
  width: 100%;
  height: calc(100% + 400px);
  min-height: calc(100% + 400px);
  background-attachment: scroll !important;
`;

const OverlayLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  /* Темний overlay для зниження контрасту - фон не відволікає від контенту */
  background: radial-gradient(
    ellipse 100% 85% at 50% 50%,
    transparent 45%,
    rgba(0, 0, 0, 0.15) 70%,
    rgba(0, 0, 0, 0.4) 100%
  );
  box-shadow: inset 0 0 15vmin 6vmin rgba(0, 0, 0, 0.25);
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 2;
  background: transparent;
`;

export const ArchiveFooterFrame: React.FC = () => {
  const parallaxOffset = useParallax(0.35);

  return (
    <FrameWrapper>
      <BackgroundLayer $offset={parallaxOffset} aria-hidden="true" />
      <OverlayLayer aria-hidden="true" />
      <ContentWrapper>
        <ArchiveSection transparentBg />
        <Footer transparentBg />
      </ContentWrapper>
    </FrameWrapper>
  );
};
