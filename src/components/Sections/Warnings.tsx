import React, { useState } from 'react';
import styled from 'styled-components';
import { useIntersection } from '../../hooks/useIntersection';

const Section = styled.section`
  padding: 80px 50px;
  position: relative;
  overflow-x: hidden;
  isolation: isolate;

  @media (max-width: 768px) {
    padding: 60px 12px;
  }
`;

const BackgroundLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: #000000;
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

const HeaderRow = styled.div<{ $isVisible: boolean }>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 32px;
  margin-bottom: 120px;
  opacity: ${props => props.$isVisible ? 1 : 0};
  filter: ${props => props.$isVisible ? 'blur(0px)' : 'blur(20px)'};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 1.2s ease-out;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 24px;
    margin-bottom: 72px;
  }
`;

const Title = styled.h2`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin: 0;
  text-align: left;
  flex-shrink: 0;
`;

const WarningText = styled.p<{ $isVisible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  color: #FF006E;
  line-height: 1.5;
  margin: 0;
  max-width: 420px;
  text-align: right;
  border: none;
  text-shadow: 0 0 24px rgba(255, 0, 110, 0.6),
               0 0 48px rgba(255, 0, 110, 0.35);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transition: opacity 1.2s ease-out 0.2s;

  @media (max-width: 768px) {
    text-align: left;
    max-width: none;
  }
`;

const Separator = styled.hr`
  border: none;
  height: 1px;
  background: rgba(0, 255, 136, 0.4);
  margin: 0;
  width: 100vw;
  margin-left: calc(50% - 50vw);
`;

const Box = styled.div<{ $isVisible: boolean; $isHovered: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 48px;
  padding: 32px 0;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: opacity 1s ease-out, transform 1s ease-out;
  cursor: pointer;
  border-radius: 4px;
  position: relative;
  pointer-events: auto;
  z-index: 1;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 24px 0;
  }
`;

const BoxTitle = styled.h3<{ $isHovered: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 600;
  font-size: 2rem;
  color: ${props => props.$isHovered ? '#00FFCC' : '#00FF88'};
  margin: 0;
  flex-shrink: 0;
  min-width: 220px;
  transition: color 350ms ease-in-out,
              text-shadow 350ms ease-in-out;
  text-shadow: ${props => props.$isHovered 
    ? '0 0 20px rgba(0, 255, 170, 0.8), 0 0 40px rgba(0, 255, 136, 0.5), 0 0 60px rgba(0, 255, 136, 0.25)' 
    : 'none'};

  &::before {
    content: '· ';
  }

  @media (max-width: 768px) {
    min-width: 0;
    font-size: 1.65rem;
  }
`;

const BoxEffects = styled.p<{ $isHovered: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: ${props => props.$isHovered ? '#FFFFFF' : 'rgba(255, 255, 255, 0.85)'};
  line-height: 1.6;
  margin: 0;
  text-align: right;
  max-width: 280px;
  transition: color 350ms ease-in-out,
              opacity 350ms ease-in-out,
              text-shadow 350ms ease-in-out;
  opacity: ${props => props.$isHovered ? 1 : 0.85};
  text-shadow: ${props => props.$isHovered 
    ? '0 0 16px rgba(0, 255, 136, 0.4), 0 0 32px rgba(0, 255, 136, 0.2)' 
    : 'none'};

  @media (max-width: 768px) {
    text-align: left;
    max-width: 100%;
  }
`;

const warnings: { title: string; effects: string[] }[] = [
  {
    title: 'Psychological effects',
    effects: [
      'Loss of identity',
      'Impaired perception of reality',
      'Emotional instability',
      'Contact may lead to irreversible changes in the psyche',
    ],
  },
  {
    title: 'Existential effects',
    effects: [
      'Loss of meaning in life',
      'Cosmic horror',
      'A sense of the futility of human existence',
      'Understanding the true nature of the universe may shatter one\'s worldview',
    ],
  },
  {
    title: 'Madness as a side effect',
    effects: [
      'Most contacts result in mental disorders of varying severity',
      'The irreversibility of these processes makes contact dangerous',
    ],
  },
];

export const Warnings: React.FC = () => {
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1 });
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Section ref={ref} aria-label="Contraindications and risks">
      <BackgroundLayer aria-hidden="true" />
      <ContentWrapper>
        <Container>
          <HeaderRow $isVisible={isIntersecting}>
            <Title>Contraindications and risks</Title>
            <WarningText $isVisible={isIntersecting}>
              ⚠ WARNING: Interaction with ancient entities carries serious risks to mental health and may lead to irreversible consequences.
            </WarningText>
          </HeaderRow>

          <Separator />

          {warnings.map((warning, index) => (
            <React.Fragment key={index}>
              <Box
                $isVisible={isIntersecting}
                $isHovered={hoveredIndex === index}
                style={{ transitionDelay: `${index * 0.1}s` }}
                role="button"
                tabIndex={0}
                aria-pressed={hoveredIndex === index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                onClick={() => setHoveredIndex(hoveredIndex === index ? null : index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setHoveredIndex(hoveredIndex === index ? null : index);
                  }
                }}
              >
                <BoxTitle $isHovered={hoveredIndex === index}>{warning.title}</BoxTitle>
                <BoxEffects $isHovered={hoveredIndex === index}>{warning.effects.join(' · ')}</BoxEffects>
              </Box>
              {index < warnings.length - 1 && <Separator />}
            </React.Fragment>
          ))}
        </Container>
      </ContentWrapper>
    </Section>
  );
};
