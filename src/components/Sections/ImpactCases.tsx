import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { TellMeMoreButton } from '../UI/TellMeMoreButton';

const AUTOPLAY_DURATION = 5000; // 5 seconds per case

interface CaseData {
  id: string;
  title: string;
  description: string;
  details: string[];
  notes: string;
  category: 'dreams' | 'cults' | 'madness';
  categoryLabel: string;
  date: string;
  image: string;
}

const casesData: CaseData[] = [
  {
    id: 'portland',
    title: 'Portland dream series',
    description: 'Multiple cases of similar dreams among city residents describing a sunken city and ancient symbols.',
    details: [
      'Over forty documented accounts within a single month. Recurring imagery of cyclopean architecture, non-Euclidean geometry, and a presence beneath the waves.',
      'Local physicians reported shared symptoms: insomnia, fever, and involuntary sketching of unknown glyphs. Several patients described identical coastal locations they had never visited.',
      'The Portland Gazette ran a series of articles before the paper ceased publication. Witnesses spoke of a "call from the deep" heard in dreams.',
    ],
    notes: 'Cross-referenced with Professor Angell\'s manuscript on the Cthulhu cult. Temporal overlap with documented global seismic anomalies is noted by the Bureau of Seismology. The Portland cases predate the Johansen narrative by approximately three months.',
    category: 'dreams',
    categoryLabel: 'DREAMS',
    date: '1925',
    image: `${process.env.PUBLIC_URL || ''}/Images/Portland%20dream%20series%20Img.png`,
  },
  {
    id: 'cult',
    title: 'New England cult',
    description: 'Formation of a secret cult worshipping ancient entities and performing rituals.',
    details: [
      'The cult emerged in remote coastal towns, drawing members from fishing communities and academic circles alike. Rituals were held at night on abandoned piers.',
      'Investigators found altars adorned with carvings matching symbols from the Portland dream reports. Several members claimed to receive "instructions" in their sleep.',
      'By 1926 the group had grown to an estimated two hundred initiates. Local authorities noted a pattern of disappearances coinciding with lunar cycles.',
    ],
    notes: "Inspector Legrasse's 1907 report describes a structurally identical organisation operating in the Louisiana bayou. The two groups show no documented contact, raising the possibility of independent emergence from a common source.",
    category: 'cults',
    categoryLabel: 'CULTS',
    date: '1926',
    image: `${process.env.PUBLIC_URL || ''}/Images/New%20England%20cult%20Img.png`,
  },
  {
    id: 'artist',
    title: 'Artist psychological breakdown',
    description: 'An artist lost his mind after a series of dreams, producing a body of work featuring incomprehensible symbols.',
    details: [
      'Richard Upton Pickman produced over fifty works in a three-month period before his institutionalization. Curators described the pieces as "geometrically impossible" and "deeply disturbing."',
      'His final exhibition was shut down by police. Viewers reported nausea, vivid nightmares, and in two cases, temporary blindness after prolonged exposure to the artwork.',
      'Pickman\'s sketches were later cross-referenced with cult materials and dream journals. The overlap was deemed significant by the Miskatonic University archive.',
    ],
    notes: "Subject's remains were never recovered from the institution. The works themselves were confiscated and transferred to Miskatonic University's restricted collection in 1931. Three curators who handled the pieces subsequently resigned without explanation.",
    category: 'madness',
    categoryLabel: 'MADNESS',
    date: '1927',
    image: `${process.env.PUBLIC_URL || ''}/Images/Artist%20psychological%20breakdown%20Img.png`,
  },
];

const Section = styled.section`
  padding: 60px 50px;
  background: #000000;
  position: relative;
  min-height: 95vh;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 60px 20px;
  }
`;

const SectionBackground = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #000000;
`;

const MainContainer = styled.div<{ $isVisible: boolean }>`
  position: relative;
  z-index: 1;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  min-height: 85vh;
  background: #0e0e0e;
  border: 1px solid rgba(0, 255, 136, 0.12);
  border-radius: 4px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: stretch;
  opacity: ${props => props.$isVisible ? 1 : 0};
  transform: ${props => props.$isVisible ? 'translateY(0)' : 'translateY(30px)'};
  transition: all 1s ease-out;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    padding: 20px 24px;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 0;
  flex: 1;
`;

const Title = styled.h2`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(2.5rem, 7vw, 4rem);
  line-height: 1.2;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin-bottom: 12px;
`;

const Subtitle = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.25rem;
  font-weight: 400;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 40px;
`;

const CasesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  flex: 1;
  min-height: 0;
`;

const fillProgress = keyframes`
  from { width: 0%; }
  to { width: 100%; }
`;

const CaseItem = styled.div<{ $isActive: boolean }>`
  padding: 18px 0;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  flex: ${props => props.$isActive ? '1' : '0 0 auto'};
  min-height: ${props => props.$isActive ? '120px' : 'auto'};
  display: flex;
  flex-direction: column;
  background: ${props => props.$isActive 
    ? 'linear-gradient(to top, rgba(0, 255, 136, 0.08) 0%, rgba(0, 255, 136, 0.02) 35%, transparent 70%)' 
    : 'transparent'};
  border-radius: 0;
  margin: ${props => props.$isActive ? '0 -12px' : '0'};
  padding: ${props => props.$isActive ? '18px 12px' : '18px 0'};
  transition: all 0.4s ease-out;
  
  /* Bottom border - grey line */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: ${props => props.$isActive ? '12px' : '0'};
    right: ${props => props.$isActive ? '12px' : '0'};
    height: 1px;
    background: rgba(255, 255, 255, 0.12);
  }
`;

const ProgressLine = styled.div<{ $isActive: boolean; $isPaused: boolean }>`
  position: absolute;
  bottom: 0;
  left: ${props => props.$isActive ? '12px' : '0'};
  height: 2px;
  background: #00FF88;
  width: 0%;
  animation: ${props => props.$isActive && !props.$isPaused ? fillProgress : 'none'} ${AUTOPLAY_DURATION}ms linear forwards;
  z-index: 1;
`;

const CaseHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 0;
`;

const CaseTitle = styled.h3<{ $isActive: boolean }>`
  font-family: ${props => props.$isActive ? "'UnifrakturCook', serif" : "'Univa Nova', sans-serif"};
  font-weight: ${props => props.$isActive ? 700 : 400};
  font-size: ${props => props.$isActive ? '2.5rem' : '1.375rem'};
  color: ${props => props.$isActive ? '#00FF88' : 'rgba(255, 255, 255, 0.6)'};
  margin: 0;
  transition: all 0.4s ease-out;
`;

const CaseCategory = styled.span<{ $category: string }>`
  padding: 6px 14px;
  border-radius: 4px;
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  background: ${props => {
    switch (props.$category) {
      case 'dreams': return 'rgba(0, 255, 136, 0.2)';
      case 'cults': return 'rgba(0, 212, 255, 0.2)';
      case 'madness': return 'rgba(123, 44, 191, 0.2)';
      default: return 'rgba(255, 255, 255, 0.1)';
    }
  }};
  color: ${props => {
    switch (props.$category) {
      case 'dreams': return '#00FF88';
      case 'cults': return '#00D4FF';
      case 'madness': return '#7B2CBF';
      default: return '#FFFFFF';
    }
  }};
`;

const CaseContent = styled.div<{ $isActive: boolean }>`
  max-height: ${props => props.$isActive ? 'none' : '0'};
  opacity: ${props => props.$isActive ? 1 : 0};
  overflow: hidden;
  transition: all 0.4s ease-out;
  margin-top: ${props => props.$isActive ? '16px' : '0'};
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const CaseDescription = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.6;
  margin: 0 0 12px 0;
`;

const CaseDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  margin-bottom: 12px;
`;

const CaseDetailParagraph = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.1875rem;
  color: rgba(255, 255, 255, 0.55);
  line-height: 1.65;
  margin: 0;
`;

const CaseDate = styled.div`
  font-family: 'Univa Nova', monospace;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.4);
  margin-top: auto;
`;


const CaseExpandedNotes = styled.div<{ $isExpanded: boolean }>`
  max-height: ${props => props.$isExpanded ? '200px' : '0'};
  opacity: ${props => props.$isExpanded ? 1 : 0};
  overflow: hidden;
  transition: max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1),
              opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: ${props => props.$isExpanded ? '12px' : '0'};
  padding-left: 12px;
  border-left: 1px solid rgba(0, 255, 136, 0.2);
`;

const CaseNotesText = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.7;
  margin: 0;
  font-style: italic;
`;

const RightColumn = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: stretch;
  margin: -20px -24px -20px 0;
  align-self: stretch;
  
  @media (max-width: 900px) {
    order: -1;
    margin: 0;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: min(520px, 55vh);
  overflow: hidden;
  position: relative;
  
  @media (max-width: 900px) {
    min-height: min(400px, 45vh);
    border-radius: 4px;
  }
`;

const CaseImage = styled.img<{ $isVisible: boolean }>`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.$isVisible ? 1 : 0};
  position: absolute;
  inset: 0;
  transition: opacity 0.6s ease-out;
`;

export const ImpactCases: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Autoplay
  useEffect(() => {
    if (!isVisible || isPaused) return;
    
    const timer = setTimeout(() => {
      setActiveIndex(prev => (prev + 1) % casesData.length);
      setProgressKey(prev => prev + 1);
    }, AUTOPLAY_DURATION);

    return () => clearTimeout(timer);
  }, [activeIndex, isVisible, isPaused, progressKey]);

  const handleCaseClick = (index: number) => {
    if (index !== activeIndex) setExpandedIndex(null);
    setActiveIndex(index);
    setProgressKey(prev => prev + 1);
  };

  return (
    <Section
      ref={sectionRef}
      aria-label="Impact cases"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setProgressKey(prev => prev + 1);
      }}
    >
      <SectionBackground aria-hidden="true" />
      <MainContainer $isVisible={isVisible}>
        <LeftColumn>
          <Title>Impact cases</Title>
          <Subtitle>
            Documented instances of influence on human consciousness
          </Subtitle>
          <CasesList>
            {casesData.map((caseItem, index) => (
              <CaseItem
                key={caseItem.id}
                $isActive={activeIndex === index}
                role="button"
                tabIndex={0}
                aria-pressed={activeIndex === index}
                onClick={() => handleCaseClick(index)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCaseClick(index);
                  }
                }}
              >
                <CaseHeader>
                  <CaseTitle $isActive={activeIndex === index}>
                    {caseItem.title}
                  </CaseTitle>
                  <CaseCategory $category={caseItem.category}>
                    {caseItem.categoryLabel}
                  </CaseCategory>
                </CaseHeader>
                <CaseContent $isActive={activeIndex === index}>
                  <CaseDescription>
                    {caseItem.description}
                  </CaseDescription>
                  <CaseDetails>
                    {caseItem.details.map((paragraph, pIndex) => (
                      <CaseDetailParagraph key={pIndex}>
                        {paragraph}
                      </CaseDetailParagraph>
                    ))}
                  </CaseDetails>
                  <TellMeMoreButton
                    isExpanded={expandedIndex === index}
                    onToggle={(e) => {
                      e.stopPropagation();
                      setExpandedIndex(expandedIndex === index ? null : index);
                    }}
                  />
                  <CaseExpandedNotes $isExpanded={expandedIndex === index}>
                    <CaseNotesText>{caseItem.notes}</CaseNotesText>
                  </CaseExpandedNotes>
                  <CaseDate>
                    {caseItem.date}
                  </CaseDate>
                </CaseContent>
                <ProgressLine 
                  key={`progress-${index}-${progressKey}`}
                  $isActive={activeIndex === index && isVisible}
                  $isPaused={isPaused}
                />
              </CaseItem>
            ))}
          </CasesList>
        </LeftColumn>
        <RightColumn>
          <ImageContainer>
            {casesData.map((caseItem, index) => (
              <CaseImage
                key={caseItem.id}
                src={caseItem.image}
                alt={caseItem.title}
                $isVisible={activeIndex === index}
              />
            ))}
          </ImageContainer>
        </RightColumn>
      </MainContainer>
    </Section>
  );
};
