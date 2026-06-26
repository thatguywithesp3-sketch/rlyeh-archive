import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { TellMeMoreButton } from '../UI/TellMeMoreButton';

interface TimelineData {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  bgImage: string;
  details: string[];
}

const timelineData: TimelineData[] = [
  {
    id: 'before-humanity',
    title: 'Before Humanity',
    subtitle: 'Arrival of Cthulhu and the Old Ones on Earth',
    description: 'Millions of years before the first humans walked the Earth, cosmic entities descended from the stars. The Old Ones established their dominion over the primordial world, building cyclopean cities of impossible geometry.',
    bgImage: `${process.env.PUBLIC_URL || ''}/Images/before%20humanity%20-%20bg.png`,
    details: [
      'Long before the emergence of human civilization, the Earth was not the silent, indifferent sphere we assume it to have been. Fragmented records, recovered from forbidden translations and disputed archaeological interpretations, suggest that other entities — vast, ancient, and wholly alien — once dominated this world.',
      'These beings, referred to in scattered sources as the Old Ones, are described not as visitors, but as primordial occupants. Cyclopean structures, geometrically inconsistent with known terrestrial design, are attributed to their presence. The purpose of such constructions remains unknown.',
      'What is most unsettling is not the implication of their existence, but the recurring suggestion that their dominion did not end in extinction — but in dormancy.',
    ],
  },
  {
    id: 'ancient-times',
    title: 'Ancient Times',
    subtitle: 'Construction of R\'lyeh and establishment of influence',
    description: 'The great city of R\'lyeh rose from the depths of the Pacific Ocean. Within its non-Euclidean walls, Cthulhu slumbers, waiting for the stars to align once more.',
    bgImage: `${process.env.PUBLIC_URL || ''}/Images/ancient%20times%20-%20bg.png`,
    details: [
      'Early mythological systems, when examined without the bias of modern rationalism, reveal striking structural similarities across distant cultures. Symbols, deities, and cosmological motifs exhibit correlations that defy conventional explanations of parallel development.',
      "Certain suppressed manuscripts and esoteric commentaries describe an era of direct influence — a period during which humanity's perception of divinity may have been shaped by external intelligences. The construction of impossible cities, most notably the submerged R'lyeh, is repeatedly cited in disputed accounts.",
      'Though widely dismissed as allegorical or pathological, these narratives persist with remarkable consistency. Their endurance raises an uncomfortable possibility: that ancient belief systems may contain distorted observations rather than pure invention.',
    ],
  },
  {
    id: 'present-day',
    title: 'Present Day',
    subtitle: 'Slumbering state and influence through dreams',
    description: 'Though physically dormant, Cthulhu\'s psychic influence reaches across the globe. Sensitive minds receive fragmented visions, artists create disturbing works, and cults gather in secret worship.',
    bgImage: `${process.env.PUBLIC_URL || ''}/Images/present%20day%20-%20bg.png`,
    details: [
      'Contemporary documentation offers no verifiable confirmation of the entities described in pre-modern sources. Nevertheless, reports of anomalous experiences, recurring dream motifs, and psychological disturbances linked to specific symbols continue to surface.',
      'Particularly notable are cases involving individuals with no prior exposure to the associated mythologies. Patterns observed in these accounts suggest the persistence of influences operating beyond conventional sensory channels.',
      'The prevailing academic position attributes such phenomena to coincidence, suggestion, or cognitive bias. However, the Archive retains these records under provisional classification, pending future reinterpretation. Absence of evidence has rarely constituted evidence of absence.',
    ],
  },
];

const Section = styled.section`
  position: relative;
  padding: 100px 16px;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const BackgroundImage = styled.div.attrs<{ $bgImage: string; $isVisible: boolean; $offset: number }>((props) => ({
  style: {
    backgroundImage: `url(${props.$bgImage})`,
    opacity: props.$isVisible ? 1 : 0,
    transform: `translateY(${props.$offset}px)`,
  },
}))<{ $bgImage: string; $isVisible: boolean; $offset: number }>`
  position: absolute;
  top: -150px;
  left: 0;
  right: 0;
  bottom: -150px;
  z-index: 0;
  background-size: cover;
  background-position: center top;
  background-repeat: no-repeat;
  transition: opacity 0.8s ease-out;
  will-change: transform;
`;

const TopGradient = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 35%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to bottom,
    #000000 0%,
    rgba(0, 0, 0, 0.8) 40%,
    rgba(0, 0, 0, 0.4) 70%,
    transparent 100%
  );
`;

const BottomGradient = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    #000000 0%,
    rgba(0, 0, 0, 0.8) 40%,
    rgba(0, 0, 0, 0.4) 70%,
    transparent 100%
  );
`;

const Container = styled.div`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  align-items: stretch;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: center;
  }
`;

const TimelineCard = styled.div<{ $isActive: boolean; $isVisible: boolean; $delay: number }>`
  position: relative;
  flex: ${props => props.$isActive ? '1.5' : '1'};
  min-width: ${props => props.$isActive ? '340px' : '200px'};
  max-width: ${props => props.$isActive ? '420px' : '280px'};
  min-height: ${props => props.$isActive ? '320px' : '200px'};
  padding: 28px;
  border-radius: 16px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  background: ${props => props.$isActive
    ? 'linear-gradient(135deg, rgba(0, 40, 30, 0.85) 0%, rgba(0, 50, 60, 0.8) 100%)'
    : 'rgba(0, 20, 15, 0.75)'};
  border-left: 4px solid ${props => props.$isActive ? '#00FF88' : 'rgba(0, 255, 136, 0.5)'};
  backdrop-filter: blur(${props => props.$isActive ? '12px' : '8px'});
  -webkit-backdrop-filter: blur(${props => props.$isActive ? '12px' : '8px'});

  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => props.$delay}s;

  &:hover {
    border-left-color: #00D4FF;
  }

  @media (max-width: 900px) {
    min-width: 100%;
    max-width: 100%;
    min-height: ${props => props.$isActive ? '280px' : '120px'};
  }
`;

const CardContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
`;

const CardTitle = styled.h3<{ $isActive: boolean }>`
  font-family: ${props => props.$isActive ? "'UnifrakturCook', serif" : "'Univa Nova', sans-serif"};
  font-weight: 700;
  font-size: ${props => props.$isActive ? 'clamp(1.75rem, 3.5vw, 2.5rem)' : '1.125rem'};
  color: #00FF88;
  margin: 0;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CardSubtitle = styled.p<{ $isActive: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.5;
  margin: 0;
  opacity: ${props => props.$isActive ? 1 : 0.7};
  transition: all 0.5s ease-out;
`;

const CardDescription = styled.p<{ $isActive: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0;
  max-height: ${props => props.$isActive ? '200px' : '0'};
  opacity: ${props => props.$isActive ? 1 : 0};
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ExpandedDetails = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '600px' : '0'};
  opacity: ${props => props.$isExpanded ? 1 : 0};
  overflow: hidden;
  transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: ${props => props.$isExpanded ? '4px' : '0'};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DetailParagraph = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.75;
  margin: 0;
  padding-left: 12px;
  border-left: 1px solid rgba(0, 255, 136, 0.15);
`;


export const TimelineSection: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('before-humanity');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const sectionCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const offset = (sectionCenter - viewportCenter) * 0.15;
      setParallaxOffset(Math.max(-80, Math.min(80, offset)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Collapse expanded details when switching to a different card
  useEffect(() => {
    setExpandedId(null);
  }, [activeId]);

  return (
    <Section ref={sectionRef} aria-label="Timeline">
      {timelineData.map(item => (
        <BackgroundImage
          key={item.id}
          $offset={parallaxOffset}
          $bgImage={item.bgImage}
          $isVisible={activeId === item.id}
          aria-hidden
        />
      ))}
      <TopGradient aria-hidden />
      <BottomGradient aria-hidden />
      <Container>
        {timelineData.map((item, index) => {
          const isActive = activeId === item.id;
          const isExpanded = expandedId === item.id;
          return (
            <TimelineCard
              key={item.id}
              $isActive={isActive}
              $isVisible={isIntersecting}
              $delay={0.2 + index * 0.15}
              role="button"
              tabIndex={0}
              aria-pressed={isActive}
              onMouseEnter={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveId(item.id);
                }
              }}
            >
              <CardContent>
                <CardTitle $isActive={isActive}>{item.title}</CardTitle>
                <CardSubtitle $isActive={isActive}>{item.subtitle}</CardSubtitle>
                <CardDescription $isActive={isActive}>
                  {item.description}
                </CardDescription>
                <ExpandedDetails $isExpanded={isExpanded}>
                  {item.details.map((para, i) => (
                    <DetailParagraph key={i}>{para}</DetailParagraph>
                  ))}
                </ExpandedDetails>
                <TellMeMoreButton
                  isActive={isActive}
                  isExpanded={isExpanded}
                  onToggle={(e) => {
                    e.stopPropagation();
                    setExpandedId(isExpanded ? null : item.id);
                  }}
                />
              </CardContent>
            </TimelineCard>
          );
        })}
      </Container>
    </Section>
  );
};
