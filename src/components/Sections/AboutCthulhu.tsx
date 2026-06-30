import React from 'react';
import styled from 'styled-components';
import { useIntersection } from '../../hooks/useIntersection';

const Section = styled.section<{ $transparent?: boolean }>`
  padding: 80px 12px;
  background: ${props => props.$transparent ? 'transparent' : '#0A0A0A'};
  position: relative;
  z-index: ${props => props.$transparent ? 2 : 1};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h2<{ $isVisible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(6rem, 22vw, 11rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  width: 100%;
  margin-bottom: -8px;
  text-align: center;
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
  opacity: ${props => props.$isVisible ? 1 : 0};
  filter: ${props => props.$isVisible ? 'blur(0px)' : 'blur(20px)'};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 1.5s ease-out;
`;

const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 680px;
  margin: 0 auto 72px;
  text-align: center;
`;

const Paragraph = styled.p<{ $isVisible: boolean; $delay: number }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.7);
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(20px)'};
  transition: all 1.2s ease-out;
  transition-delay: ${props => props.$delay}s;
`;


export const AboutCthulhu: React.FC<{ transparentBg?: boolean }> = ({ transparentBg = false }) => {
  const { ref, isIntersecting } = useIntersection({ threshold: 0.1 });

  return (
    <Section ref={ref} $transparent={transparentBg}>
      <Container>
        <Title $isVisible={isIntersecting}>About Cthulhu</Title>
        <TextContent>
          <Paragraph $isVisible={isIntersecting} $delay={0.2}>
            Cthulhu is an ancient cosmic entity, a member of the Old Ones race 
            that came to Earth millions of years ago, before the rise of humanity.
          </Paragraph>
          <Paragraph $isVisible={isIntersecting} $delay={0.4}>
            The sunken city of R'lyeh serves as the locus of the entity's slumber, 
            from which it influences human consciousness through dreams and the subconscious.
          </Paragraph>
          <Paragraph $isVisible={isIntersecting} $delay={0.6}>
            The alignment of stars and ancient cycles of time determine periods of activity 
            and potential awakening of the entity.
          </Paragraph>
        </TextContent>
      </Container>
    </Section>
  );
};
