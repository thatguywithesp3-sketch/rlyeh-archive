import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useIntersection } from '../../hooks/useIntersection';
import { useParallaxInView } from '../../hooks/useParallaxInView';

// --- Зображення секції Archive ---
// Фон за книгами (на весь BooksFrame) — затемнений
const ARCHIVE_FRAME_BG = `${process.env.PUBLIC_URL || ''}/Images/archive-bg2.png`;
// Default image: усі 4 книги на полиці, без підсвітки
const DEFAULT_IMAGE = `${process.env.PUBLIC_URL || ''}/Images/archive-bg.png`;
// Highlight images: по одному зображенню на книгу (книга з мʼякою зеленою підсвіткою)
const HIGHLIGHT_IMAGES = [
  `${process.env.PUBLIC_URL || ''}/Images/symbols-highlighted.png`,
  `${process.env.PUBLIC_URL || ''}/Images/quotations-highlighted.png`,
  `${process.env.PUBLIC_URL || ''}/Images/artifacts-highlighted.png`,
  `${process.env.PUBLIC_URL || ''}/Images/documents-highlighted.png`,
];

/* Зображення 3998×2100 px — пропорції для ImageArea */
const IMAGE_ASPECT = 3998 / 2100;

const BOOK_LINKS = [
  { to: '/archive#symbols', label: 'Symbols', left: 30.27, width: 10.06 },
  { to: '/archive#quotations', label: 'Quotations', left: 40.32, width: 9.6 },
  { to: '/archive#artifacts', label: 'Artifacts', left: 50.03, width: 9.66 },
  { to: '/archive#documents', label: 'Documents', left: 59.63, width: 10.06 },
];

const Section = styled.section<{ $transparentBg?: boolean }>`
  min-height: 90vh;
  padding: clamp(120px, 18vh, 220px) 16px clamp(80px, 12vh, 160px);
  position: relative;
  isolation: isolate;
`;

const BackgroundLayer = styled.div.attrs<{ $transparentBg?: boolean }>((props) => ({
  style: {
    background: props.$transparentBg ? 'transparent' : '#0A0A0A',
    backgroundColor: props.$transparentBg ? 'transparent' : '#0A0A0A',
  },
}))<{ $transparentBg?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  pointer-events: none;
`;

const ContentWrapper = styled.div`
  position: relative;
  z-index: 1;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

/* Заголовок у стилі затухання як Interaction methods / About Cthulhu */
const Title = styled.h2<{ $isVisible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(3rem, 12vw, 9rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  width: 100%;
  margin-bottom: min(6vw, 48px);
  text-align: center;
  white-space: nowrap;
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
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  filter: ${(props) => (props.$isVisible ? 'blur(0px)' : 'blur(20px)')};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 1.5s ease-out;
`;

// --- Фрейм з книгами: фон на всю висоту секції + градієнти зверху/знизу ---
const BooksFrame = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #000;
  /* Відступ зверху: заголовок чітко над книгами, без накладання */
  padding-top: min(92%, 800px);
  box-sizing: border-box;
`;

/* Фон за книгами — на всю висоту секції, паралакс як у Hero */
const BooksFrameBg = styled.div<{ $offset: number }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-color: #000;
  background-image: url('${ARCHIVE_FRAME_BG}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  transform: translateY(${(props) => props.$offset}px);
  will-change: transform;
`;

/* Затемнення зверху — плавний перехід від чорного до прозорого */
const TopOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 35%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.4) 40%,
    transparent 100%
  );
`;

/* Затемнення знизу — сильне, затемнює книги знизу для плавного переходу */
const BottomOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.98) 0%,
    rgba(0, 0, 0, 0.85) 20%,
    rgba(0, 0, 0, 0.6) 45%,
    rgba(0, 0, 0, 0.3) 70%,
    transparent 100%
  );
`;

/* Область зображення: пропорція 3998×2100 — хітбокси стоять чітко по книгах */
const ImageArea = styled.div`
  position: relative;
  z-index: 1;
  width: min(100%, calc(98vh * ${IMAGE_ASPECT}));
  aspect-ratio: ${IMAGE_ASPECT};
  flex-shrink: 0;
  max-height: 98vh;
`;

/* Нижнє затемнення безпосередньо на книгах — градієнт знизу */
const BooksBottomOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 55%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.9) 0%,
    rgba(0, 0, 0, 0.5) 40%,
    rgba(0, 0, 0, 0.15) 75%,
    transparent 100%
  );
`;

// Default image: завжди видимий, нижній шар; contain — зображення видно повністю
const FrameBgDefault = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: url('${DEFAULT_IMAGE}');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
`;

// Highlight image: верхній шар, opacity керується через inline style (crossfade)
const FrameBgHighlight = styled.div.attrs<{ $opacity: number; $imageUrl: string | null }>(
  (props) => ({
    style: {
      opacity: props.$opacity,
      backgroundImage: props.$imageUrl ? `url(${props.$imageUrl})` : 'none',
    },
  })
)<{ $opacity: number; $imageUrl: string | null }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  transition: opacity 1.4s ease-in-out;
`;

/* Хітбокси: позиція та ширина по зображенню книг (3998×2100, книги по центру) */
const HitBoxRow = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
`;

const HitBox = styled(Link)<{ $left: number; $width: number }>`
  position: absolute;
  left: ${(props) => props.$left}%;
  width: ${(props) => props.$width}%;
  top: 0;
  height: 100%;
  cursor: pointer;
  text-decoration: none;
  &:focus-visible {
    outline: 1px solid rgba(0, 255, 136, 0.4);
    outline-offset: 2px;
  }
`;

export const ArchiveSection: React.FC<{ transparentBg?: boolean }> = ({ transparentBg }) => {
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1 });
  const [hoveredBook, setHoveredBook] = useState<number | null>(null);
  const parallaxOffset = useParallaxInView(ref, 0.35);

  const highlightOpacity = hoveredBook !== null ? 1 : 0;
  const highlightImageUrl = hoveredBook !== null ? HIGHLIGHT_IMAGES[hoveredBook] : null;

  return (
    <Section ref={ref} $transparentBg={transparentBg}>
      <BackgroundLayer $transparentBg={transparentBg} aria-hidden="true" />
      <BooksFrame
          onMouseLeave={() => setHoveredBook(null)}
          aria-label="Archive books"
        >
          <BooksFrameBg $offset={parallaxOffset} aria-hidden="true" />
          <TopOverlay aria-hidden="true" />
          <BottomOverlay aria-hidden="true" />
          <ImageArea>
            {/* Default image — усі 4 книги без підсвітки */}
            <FrameBgDefault aria-hidden="true" />

            {/* Highlight image — crossfade при hover, без scale/glow */}
            <FrameBgHighlight
              $opacity={highlightOpacity}
              $imageUrl={highlightImageUrl}
              aria-hidden="true"
            />

            <BooksBottomOverlay aria-hidden="true" />

            {/* Hit-box області: ширина та висота чітко по зображенню кожної книги */}
            <HitBoxRow>
              {BOOK_LINKS.map((item, index) => (
                <HitBox
                  key={index}
                  to={item.to}
                  $left={item.left}
                  $width={item.width}
                  onMouseEnter={() => setHoveredBook(index)}
                  aria-label={item.label}
                />
              ))}
            </HitBoxRow>
          </ImageArea>
        </BooksFrame>
      <ContentWrapper>
        <Container>
          <Title $isVisible={isIntersecting}>Archive</Title>
        </Container>
      </ContentWrapper>
    </Section>
  );
};
