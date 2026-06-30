import React, { useState, useCallback, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { TellMeMoreButton } from '../UI/TellMeMoreButton';

// Breathing animation - very subtle opacity change
const breathe = keyframes`
  0%, 100% { opacity: 0.55; }
  50% { opacity: 0.58; }
`;

// Eye glow pulse - extremely subtle
const eyeGlow = keyframes`
  0%, 100% { 
    filter: brightness(1) saturate(1);
  }
  50% { 
    filter: brightness(1.02) saturate(1.05);
  }
`;

const Section = styled.div`
  padding: 80px 16px 120px;
  min-height: 85vh;
  background: #000000;
  position: relative;
  overflow: hidden;
`;

const BackgroundLayer = styled.div.attrs<{ 
  $offsetX: number; 
  $offsetY: number; 
  $isHovered: boolean;
}>((props) => ({
  style: {
    transform: `translate(${props.$offsetX}px, ${props.$offsetY}px) scale(1.02)`,
    filter: props.$isHovered 
      ? 'brightness(1.15) saturate(1.2) contrast(1.05)' 
      : 'brightness(1) saturate(1)',
  },
}))<{ 
  $offsetX: number; 
  $offsetY: number; 
  $isHovered: boolean;
}>`
  position: absolute;
  top: 80px; /* Positioned lower from section top */
  right: -45px;
  bottom: -45px;
  left: -45px;
  z-index: 0;
  background: url('${process.env.PUBLIC_URL || ''}/Images/interaction-methods-bg.webp') center top/cover no-repeat;
  will-change: transform, opacity, filter;
  transition: transform 0.15s ease-out, filter 0.5s ease-out, opacity 0.4s ease-out;
  
  /* Breathing animation */
  animation: ${breathe} 10s ease-in-out infinite;
  
  /* Glow enhancement on hover */
  ${props => props.$isHovered && css`
    animation: ${breathe} 10s ease-in-out infinite, ${eyeGlow} 4s ease-in-out infinite;
  `}
  
  /* Respect reduced motion preference - smooth fallback */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
    transform: scale(1.02) !important;
    opacity: 0.55;
    transition: opacity 1s ease-out, filter 0.5s ease-out;
  }
`;

const GradientOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.3) 15%,
    rgba(0, 0, 0, 0.1) 50%,
    rgba(0, 0, 0, 0.3) 85%,
    rgba(0, 0, 0, 0.85) 100%
  );
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const Title = styled.h2`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(3rem, 12vw, 9rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  width: 100%;
  margin-bottom: 24px;
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
`;

const StepsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0;
  margin-top: 60px;
  
  @media (max-width: 900px) {
    flex-direction: column;
  }
`;

const StepBackgroundImage = styled.img<{ $isActive: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
    opacity: ${props => props.$isActive ? 1 : 0.01};
  visibility: visible;
  transition: opacity 0.5s ease-out;
  pointer-events: none;
  display: block;
`;

const Step = styled.div<{ $isActive: boolean }>`
  flex: ${props => props.$isActive ? '2' : '1'};
  min-width: 0;
  min-height: ${props => props.$isActive ? '600px' : 'auto'};
  padding: 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Green gradient overlay - light highlight */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background: ${props => props.$isActive 
      ? 'linear-gradient(to top, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 40%, transparent 70%)' 
      : 'transparent'};
    transition: background 0.4s ease-out;
  }
  
  /* Dashed top border for inactive */
  border-top: 1px dashed rgba(255, 255, 255, 0.2);
  
  /* Bottom border - green when active */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 2px;
    z-index: 2;
    background: ${props => props.$isActive ? '#00FF88' : 'transparent'};
    transition: background 0.4s ease-out;
  }
  
  @media (max-width: 900px) {
    min-height: ${props => props.$isActive ? '500px' : 'auto'};
    border-top: none;
    border-left: 1px dashed rgba(255, 255, 255, 0.2);
    
    &::after {
      left: 0;
      top: 0;
      bottom: 0;
      right: auto;
      width: 2px;
      height: auto;
    }
    
    &::before {
      background: ${props => props.$isActive 
        ? 'linear-gradient(to right, rgba(0, 255, 136, 0.15) 0%, rgba(0, 255, 136, 0.05) 40%, transparent 70%)' 
        : 'transparent'};
    }
  }
`;

const StepNumber = styled.div<{ $isActive: boolean }>`
  position: relative;
  z-index: 1;
  font-family: 'Univa Nova', monospace;
  font-size: ${props => props.$isActive ? '1.5rem' : '1.25rem'};
  font-weight: 400;
  color: ${props => props.$isActive ? '#00FF88' : 'rgba(255, 255, 255, 0.4)'};
  margin-bottom: 12px;
  transition: all 0.4s ease-out;
`;

const StepContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px 20px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%);
  width: 100%;
`;

const StepTitle = styled.h3<{ $isActive: boolean }>`
  font-family: ${props => props.$isActive ? "'UnifrakturCook', serif" : "'Univa Nova', sans-serif"};
  font-weight: ${props => props.$isActive ? 700 : 400};
  font-size: ${props => props.$isActive ? 'clamp(2rem, 5vw, 2.75rem)' : '1.25rem'};
  color: ${props => props.$isActive ? '#00FF88' : 'rgba(255, 255, 255, 0.6)'};
  margin: 0;
  line-height: 1.3;
  transition: all 0.4s ease-out;
`;

const StepDescription = styled.p<{ $isActive: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  max-height: ${props => props.$isActive ? '300px' : '0'};
  opacity: ${props => props.$isActive ? 1 : 0};
  overflow: hidden;
  margin: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;


const StepExpanded = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '500px' : '0'};
  opacity: ${props => props.$isExpanded ? 1 : 0};
  overflow: hidden;
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: ${props => props.$isExpanded ? '4px' : '0'};
`;

const StepDetailParagraph = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.75;
  margin: 0;
  padding-left: 12px;
  border-left: 1px solid rgba(0, 255, 136, 0.15);
`;

const steps = [
  {
    number: '01',
    title: 'Preparation',
    description: 'Rituals and symbols, required materials, psychological preparation for contact.',
    image: `${process.env.PUBLIC_URL || ''}/Images/preparation-bg.webp`,
    details: [
      'Ritual preparation begins no less than seven days prior to contact. Required materials vary by account, but recurring elements include a circle of salt, objects of personal significance placed at cardinal points, and complete sensory isolation.',
      'The practitioner\'s psychological state at the time of contact appears to be a primary determinant of outcome. Several accounts note that prior trauma or fragmented identity may amplify the entity\'s influence beyond safe parameters.',
      'The Orne Library holds seventeen documented preparation protocols. Of these, eleven are classified under restricted access. No fully reliable protocol has been formally endorsed by the Archive.',
    ],
  },
  {
    number: '02',
    title: 'Contact through dreams',
    description: 'Techniques for entering the state, role of the subconscious, safety of the interaction process.',
    image: `${process.env.PUBLIC_URL || ''}/Images/contact through dreams-bg.webp`,
    details: [
      'Contact occurs during the threshold state between wakefulness and sleep — specifically during the hypnagogic phase, where the conscious mind retains partial awareness. Deliberate entry into this state reduces the risk of complete psychic dissolution.',
      'The entity does not speak in words recognisable to the waking mind. Communication appears to operate through impression, symbol, and an overwhelming sense of spatial wrongness.',
      'Attempts to record these impressions immediately upon waking have produced some of the most significant materials held in the Archive\'s collection. Delay of more than four minutes appears to result in near-total amnesia of the contact event.',
    ],
  },
  {
    number: '03',
    title: 'Subconscious and languages',
    description: 'Ancient languages, symbols and their meanings, communication protocols with the entity.',
    image: `${process.env.PUBLIC_URL || ''}/Images/subconscious and languages-bg.webp`,
    details: [
      'R\'lyehan — the closest designation given to the entity\'s communication mode — does not follow phonological or syntactic rules compatible with any known human language family. Linguistic analysis suggests a grammar oriented around spatial rather than temporal relations.',
      'Sensitives who have achieved partial translation report that meaning is not carried by individual symbols or sounds, but by their relational arrangement. Meaning arrives complete, without the processing stage that human cognition normally requires.',
      'This may explain the persistent disorientation experienced by practitioners: the cognitive apparatus is bypassed entirely. Several subjects reported understanding statements they could not subsequently recall having heard.',
    ],
  },
  {
    number: '04',
    title: 'Phrases and formulae',
    description: 'Key phrases, correct pronunciation, sequence of actions for establishing contact.',
    image: `${process.env.PUBLIC_URL || ''}/Images/phrases and formulae-bg.webp`,
    details: [
      '"Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn" — translated approximately as "In his house at R\'lyeh, dead Cthulhu waits dreaming" — is the most widely documented phrase associated with cult practice. Its function appears to be invocational rather than descriptive.',
      'Pronunciation guides recovered from cult materials emphasise the guttural consonant clusters and nasal resonance over intelligibility. Correct pronunciation is reported to induce perceptible physical sensations in bystanders with no prior exposure to the material.',
      'The mechanism for this effect has not been established. The Archive classifies all known formulae as hazardous materials. Unsupervised recitation is strongly discouraged.',
    ],
  },
];

export const InteractionMethods: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeIndex, setActiveIndex] = useState(2);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // Check for reduced motion preference
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  );

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (prefersReducedMotion.current) return;
    
    const section = sectionRef.current;
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate offset from center (-1 to 1)
    const normalizedX = (e.clientX - centerX) / (rect.width / 2);
    const normalizedY = (e.clientY - centerY) / (rect.height / 2);
    
    // Max 40px movement for stronger parallax effect
    const maxOffset = 40;
    setMouseOffset({
      x: normalizedX * maxOffset,
      y: normalizedY * maxOffset
    });
  }, []);

  const handleMouseEnter = useCallback(() => {
    if (!prefersReducedMotion.current) {
      setIsHovered(true);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  return (
    <Section
      ref={sectionRef}
      aria-label="Interaction methods"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <BackgroundLayer 
        $offsetX={mouseOffset.x} 
        $offsetY={mouseOffset.y}
        $isHovered={isHovered}
      />
      <GradientOverlay />
      <Container>
        <Title>Interaction methods</Title>
        <StepsContainer>
          {steps.map((step, index) => {
            const isActive = index === activeIndex;
            return (
              <Step
                key={index}
                $isActive={isActive}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                onClick={() => {
                  if (activeIndex !== index) {
                    setExpandedIndex(null);
                    setActiveIndex(index);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (activeIndex !== index) {
                      setExpandedIndex(null);
                      setActiveIndex(index);
                    }
                  }
                }}
              >
                {step.image && (
                  <StepBackgroundImage
                    src={step.image.split('/').map((part, i, arr) =>
                      i === arr.length - 1 ? encodeURIComponent(part) : part
                    ).join('/')}
                    alt=""
                    loading="lazy"
                    $isActive={isActive}
                    onError={(e) => {
                      // Hide the layer if its background image fails to load.
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <StepNumber $isActive={isActive}>{step.number}</StepNumber>
                <StepContent>
                  <StepTitle $isActive={isActive}>{step.title}</StepTitle>
                  <StepDescription $isActive={isActive}>{step.description}</StepDescription>
                  <StepExpanded $isExpanded={expandedIndex === index}>
                    {step.details.map((para, i) => (
                      <StepDetailParagraph key={i}>{para}</StepDetailParagraph>
                    ))}
                  </StepExpanded>
                  <TellMeMoreButton
                    isActive={isActive}
                    isExpanded={expandedIndex === index}
                    onToggle={(e) => {
                      e.stopPropagation();
                      setExpandedIndex(expandedIndex === index ? null : index);
                    }}
                  />
                </StepContent>
              </Step>
            );
          })}
        </StepsContainer>
      </Container>
    </Section>
  );
};
