import React, { useState, useCallback, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useIntersection } from '../hooks/useIntersection';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const PUBLIC = process.env.PUBLIC_URL || '';
const ARCHIVE_VIDEO = `${PUBLIC}/videos/archive_hero_bg.mp4`;

/* ═══════════════════════════════════════════════
   ERA DATA — Chronology
   ═══════════════════════════════════════════════ */

const ERA_IMAGES = [
  `${PUBLIC}/Images/before%20humanity%20-%20bg.webp`,
  `${PUBLIC}/Images/ancient%20times%20-%20bg.webp`,
  `${PUBLIC}/Images/present%20day%20-%20bg.webp`,
];

interface EraRecord {
  id: string;
  number: string;
  label: string;
  title: string;
  body: string[];
}

const ERAS: EraRecord[] = [
  {
    id: 'before-humanity',
    number: '01',
    label: 'Before Humanity',
    title: 'Before Humanity',
    body: [
      'Long before the emergence of human civilization, the Earth was not the silent, indifferent sphere we assume it to have been. Fragmented records, recovered from forbidden translations and disputed archaeological interpretations, suggest that other entities — vast, ancient, and wholly alien — once dominated this world.',
      'These beings, referred to in scattered sources as the Old Ones, are described not as visitors, but as primordial occupants. Cyclopean structures, geometrically inconsistent with known terrestrial design, are attributed to their presence. The purpose of such constructions remains unknown.',
      'What is most unsettling is not the implication of their existence, but the recurring suggestion that their dominion did not end in extinction, but in dormancy.',
    ],
  },
  {
    id: 'ancient-times',
    number: '02',
    label: 'Ancient Times',
    title: 'Ancient Times',
    body: [
      'Early mythological systems, when examined without the bias of modern rationalism, reveal striking structural similarities across distant cultures. Symbols, deities, and cosmological motifs exhibit correlations that defy conventional explanations of parallel development.',
      'Certain suppressed manuscripts and esoteric commentaries describe an era of direct influence — a period during which humanity\'s perception of divinity may have been shaped by external intelligences. The construction of impossible cities, most notably the submerged R\'lyeh, is repeatedly cited in disputed accounts.',
      'Though widely dismissed as allegorical or pathological, these narratives persist with remarkable consistency. Their endurance raises an uncomfortable possibility: that ancient belief systems may contain distorted observations rather than pure invention.',
    ],
  },
  {
    id: 'present-day',
    number: '03',
    label: 'Present Day',
    title: 'Present Day',
    body: [
      'Contemporary documentation offers no verifiable confirmation of the entities described in pre-modern sources. Nevertheless, reports of anomalous experiences, recurring dream motifs, and psychological disturbances linked to specific symbols continue to surface.',
      'Particularly notable are cases involving individuals with no prior exposure to the associated mythologies. Patterns observed in these accounts suggest the persistence of influences operating beyond conventional sensory channels.',
      'The prevailing academic position attributes such phenomena to coincidence, suggestion, or cognitive bias. However, the Archive retains these records under provisional classification, pending future reinterpretation.',
      'Absence of evidence, as repeatedly demonstrated in the University\'s restricted collections, has rarely constituted evidence of absence.',
    ],
  },
];

/* ═══════════════════════════════════════════════
   CATALOGUE DATA
   ═══════════════════════════════════════════════ */

/* ═══════════════════════════════════════════════
   SYMBOLS — Carousel data
   ═══════════════════════════════════════════════ */

interface SymbolEntry {
  id: string;
  title: string;
  description: string;
  image: string;
}

const SYMBOLS: SymbolEntry[] = [
  {
    id: 'elder-sign',
    title: 'The Elder Sign',
    description: 'Protective ward against the Old Ones. Found etched into stone thresholds and burial markers across disparate civilizations.',
    image: `${PUBLIC}/Images/The_Elder_Sign%20%E2%80%94%20protective_ward_against_the_Old_Ones_img.webp`,
  },
  {
    id: 'star-glyph',
    title: 'Star-Shaped Glyph',
    description: 'Central sigil of Cthulhu cultists. Appears in ritual carvings, dream journals, and the walls of submerged structures.',
    image: `${PUBLIC}/Images/Star-shaped_glyph_of_Cthulhu_cultists_img.webp`,
  },
  {
    id: 'rlyeh-cipher',
    title: 'R\'lyeh Cipher Fragments',
    description: 'Geometric patterns recovered from deep-sea expeditions. Resist mathematical classification and induce unease upon prolonged study.',
    image: `${PUBLIC}/Images/R%27lyeh_geometric_cipher_fragments_img.webp`,
  },
  {
    id: 'dagon-marks',
    title: 'Dagon Worship Marks',
    description: 'Found in Innsmouth and surrounding coastal settlements. Linked to deep one contact rituals and tidal ceremonies.',
    image: `${PUBLIC}/Images/Dagon_worship_marks_found_in_Innsmouth_img.webp`,
  },
  {
    id: 'dream-symbols',
    title: 'Dream-State Symbols',
    description: 'Recorded by sensitives under controlled observation. Recurring motifs correlate with seismic activity near Pacific coordinates.',
    image: `${PUBLIC}/Images/Dream-state_symbols_recorded_by_sensitives_img.webp`,
  },
];

const categoryData = [
  {
    id: 'quotations',
    title: 'Quotations',
    description: 'Phrases, chants, and utterances collected from cult manuscripts, testimony transcripts, and dream journals. Many resist translation; some resist memory.',
    entries: [
      '"Ph\'nglui mglw\'nafh Cthulhu R\'lyeh wgah\'nagl fhtagn"',
      'Testimony of Gustaf Johansen, 1925',
      'The Ponape Scripture fragments',
      'Professor Angell\'s final notes',
      'Dream-speech of Wilcox, March 1925',
    ],
  },
  {
    id: 'artifacts',
    title: 'Artifacts',
    description: 'Physical objects of anomalous origin or influence. Each artifact has been catalogued under controlled conditions. Prolonged exposure is not advised.',
    entries: [
      'Cthulhu bas-relief (Wilcox, 1925)',
      'Innsmouth tiara — deep one craftsmanship',
      'R\'lyeh stone fragment, recovered 1928',
      'Cult idol from Louisiana swamp raid',
      'Unidentified metallic object, Antarctic expedition',
    ],
  },
];

/* ═══════════════════════════════════════════════
   CASE FILES DATA
   ═══════════════════════════════════════════════ */

const caseFiles = [
  {
    id: 'case-portland',
    reference: 'DOC-1925-PDS',
    classification: 'DREAMS',
    status: 'CLOSED — UNRESOLVED',
    title: 'Portland Dream Series',
    date: '1925',
    location: 'Portland, Oregon',
    summary: 'Multiple cases of similar dreams among city residents describing a sunken city and ancient symbols.',
    findings: [
      'Over forty documented accounts within a single month. Recurring imagery of cyclopean architecture, non-Euclidean geometry, and a presence beneath the waves.',
      'Local physicians reported shared symptoms: insomnia, fever, and involuntary sketching of unknown glyphs. Several patients described identical coastal locations they had never visited.',
      'The Portland Gazette ran a series of articles before the paper ceased publication. Witnesses spoke of a "call from the deep" heard in dreams.',
    ],
    notes: 'Cross-referenced with Professor Angell\'s manuscript. Temporal overlap with global seismic anomalies noted by the Bureau of Seismology.',
  },
  {
    id: 'case-cult',
    reference: 'DOC-1926-NEC',
    classification: 'CULTS',
    status: 'ACTIVE — MONITORED',
    title: 'New England Cult',
    date: '1926',
    location: 'Coastal New England',
    summary: 'Formation of a secret cult worshipping ancient entities and performing rituals.',
    findings: [
      'The cult emerged in remote coastal towns, drawing members from fishing communities and academic circles alike. Rituals were held at night on abandoned piers.',
      'Investigators found altars adorned with carvings matching symbols from the Portland dream reports. Several members claimed to receive "instructions" in their sleep.',
      'By 1926 the group had grown to an estimated two hundred initiates. Local authorities noted a pattern of disappearances coinciding with lunar cycles.',
    ],
    notes: 'Inspector Legrasse\'s 1907 report describes a similar organization in Louisiana. Possible continuity across decades and regions.',
  },
  {
    id: 'case-artist',
    reference: 'DOC-1927-APB',
    classification: 'MADNESS',
    status: 'CLOSED — SUBJECT DECEASED',
    title: 'Artist Psychological Breakdown',
    date: '1927',
    location: 'Boston, Massachusetts',
    summary: 'An artist lost his mind after a series of dreams, producing a body of work featuring incomprehensible symbols.',
    findings: [
      'Richard Upton Pickman produced over fifty works in a three-month period before his institutionalization. Curators described the pieces as "geometrically impossible" and "deeply disturbing."',
      'His final exhibition was shut down by police. Viewers reported nausea, vivid nightmares, and in two cases, temporary blindness after prolonged exposure to the artwork.',
      'Pickman\'s sketches were later cross-referenced with cult materials and dream journals. The overlap was deemed significant by the Miskatonic University archive.',
    ],
    notes: 'Subject\'s remains were never recovered from the institution. Case file transferred to Miskatonic special collections, 1931.',
  },
];

/* ═══════════════════════════════════════════════
   ANIMATIONS
   ═══════════════════════════════════════════════ */

/* (animations defined inline where needed) */

/* ═══════════════════════════════════════════════
   STYLED COMPONENTS — Page shell
   ═══════════════════════════════════════════════ */

const Page = styled.div`
  min-height: 100vh;
  background: #000000;
  position: relative;
  padding-bottom: 100px;
`;

/* ─── Hero — fullscreen video background ─── */

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #000000;
`;

const HeroBgVideo = styled.video`
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
`;

const HeroDarkOverlay = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background: radial-gradient(
    ellipse at center,
    rgba(0, 0, 0, 0.15) 0%,
    rgba(0, 0, 0, 0.35) 50%,
    rgba(0, 0, 0, 0.65) 100%
  );
`;

const HeroBottomFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    #000000 0%,
    rgba(0, 0, 0, 0.7) 30%,
    rgba(0, 0, 0, 0.3) 60%,
    transparent 100%
  );
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 16px;
`;

const HeroTitle = styled.h1<{ $visible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(6rem, 24vw, 18rem);
  line-height: 1.0;
  letter-spacing: -0.02em;
  margin: 0;
  background: linear-gradient(
    to bottom,
    #FFFFFF 0%,
    #FFFFFF 20%,
    rgba(255, 255, 255, 0.9) 40%,
    rgba(220, 220, 220, 0.7) 60%,
    rgba(160, 160, 160, 0.4) 80%,
    rgba(100, 100, 100, 0.15) 95%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: ${p => (p.$visible ? 1 : 0)};
  filter: ${p => (p.$visible ? 'blur(0)' : 'blur(20px)')};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 1.5s ease-out;
`;

/* ═══════════════════════════════════════════════
   CHRONOLOGY — Expanding panel system
   ═══════════════════════════════════════════════

   Layout: horizontal flex of 3 panels.
   Active panel expands to ~70% width.
   Inactive panels compress to narrow vertical strips.
   Each panel has its own background image.
   Exactly one panel is always expanded.
   ═══════════════════════════════════════════════ */

/* Cinematic easing — heavy, deliberate */
const PANEL_EASING = 'cubic-bezier(0.45, 0.05, 0.25, 0.95)';
const PANEL_DURATION = '800ms';

const ChronoSection = styled.section`
  position: relative;
  width: 100%;
  height: 100vh;
  background: #000000;
  overflow: hidden;
  display: flex;
  flex-direction: row;

  @media (max-width: 768px) {
    flex-direction: column;
    height: auto;
    min-height: 100vh;
  }
`;

/* Individual era panel — expands/collapses */
const EraPanel = styled.div<{ $active: boolean }>`
  position: relative;
  flex: ${p => p.$active ? '7' : '1'};
  min-width: 0;
  height: 100%;
  overflow: hidden;
  cursor: ${p => p.$active ? 'default' : 'pointer'};
  border-right: 1px solid rgba(255, 255, 255, 0.04);
  transition: flex ${PANEL_DURATION} ${PANEL_EASING};

  &:last-child {
    border-right: none;
  }

  @media (max-width: 768px) {
    flex: ${p => p.$active ? '7' : '1'};
    height: auto;
    min-height: ${p => p.$active ? '80vh' : '80px'};
    border-right: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    transition:
      flex ${PANEL_DURATION} ${PANEL_EASING},
      min-height ${PANEL_DURATION} ${PANEL_EASING};

    &:last-child { border-bottom: none; }
  }
`;

/* Background image — full color, moody, alive */
const PanelBg = styled.div<{ $url: string; $active: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: url('${p => p.$url}');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  /* Colored and visible — NOT monochrome */
  filter: ${p => p.$active
    ? 'saturate(0.7) brightness(0.55)'
    : 'saturate(0.35) brightness(0.25)'};
  transform: ${p => p.$active ? 'scale(1.0)' : 'scale(1.03)'};
  transition:
    filter 900ms ${PANEL_EASING},
    transform 1200ms ${PANEL_EASING};
  will-change: filter, transform;

  /* Subtle brightness lift on hover for inactive panels */
  ${EraPanel}:hover & {
    filter: ${p => p.$active
      ? 'saturate(0.7) brightness(0.55)'
      : 'saturate(0.45) brightness(0.32)'};
  }
`;

/* Dark overlay — lighter for active, moderate for inactive */
const PanelOverlay = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  transition: background ${PANEL_DURATION} ${PANEL_EASING};
  background: ${p => p.$active
    ? `linear-gradient(
        135deg,
        rgba(0, 0, 0, 0.55) 0%,
        rgba(0, 0, 0, 0.35) 40%,
        rgba(0, 0, 0, 0.45) 100%
      )`
    : 'rgba(0, 0, 0, 0.5)'};

  /* Slightly lighten on hover for inactive */
  ${EraPanel}:hover & {
    background: ${p => p.$active
      ? `linear-gradient(
          135deg,
          rgba(0, 0, 0, 0.55) 0%,
          rgba(0, 0, 0, 0.35) 40%,
          rgba(0, 0, 0, 0.45) 100%
        )`
      : 'rgba(0, 0, 0, 0.4)'};
  }
`;

/* Subtle green glow overlay — only for active panel */
const PanelGreenGlow = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: ${p => p.$active ? 1 : 0};
  transition: opacity 1000ms ${PANEL_EASING};
  background: radial-gradient(
    ellipse at 30% 50%,
    rgba(0, 255, 136, 0.04) 0%,
    rgba(0, 255, 136, 0.015) 40%,
    transparent 70%
  );
`;

/* Bottom gradient — continuity into next section */
const PanelBottomFade = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 25%;
  z-index: 1;
  pointer-events: none;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.8) 0%,
    rgba(0, 0, 0, 0.3) 50%,
    transparent 100%
  );
`;

/* Grain texture — atmospheric */
const PanelGrain = styled.div`
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 256px 256px;
`;

/* ─── Collapsed state — vertical label + number ─── */

const CollapsedContent = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: 0;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 0 0 48px;
  opacity: ${p => p.$active ? 0 : 1};
  pointer-events: ${p => p.$active ? 'none' : 'auto'};
  transition: opacity 600ms ${PANEL_EASING};

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
  }
`;

const CollapsedLabel = styled.span`
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 28px;
  white-space: nowrap;
  transition: color 300ms ease-in-out;

  /* Brighten on panel hover */
  ${EraPanel}:hover & {
    color: rgba(255, 255, 255, 0.75);
  }

  @media (max-width: 768px) {
    writing-mode: horizontal-tb;
    margin-bottom: 0;
    font-size: 0.9375rem;
  }
`;

const CollapsedNumber = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 2.75rem;
  font-weight: 300;
  color: rgba(0, 255, 136, 0.4);
  text-shadow: 0 0 20px rgba(0, 255, 136, 0.15);
  transition: color 300ms ease-in-out, text-shadow 300ms ease-in-out;

  /* Intensify glow on panel hover */
  ${EraPanel}:hover & {
    color: rgba(0, 255, 136, 0.65);
    text-shadow: 0 0 30px rgba(0, 255, 136, 0.25), 0 0 60px rgba(0, 255, 136, 0.08);
  }
`;

/* Hover overlay for collapsed panels — subtle brightness lift + green atmospheric tint */
const CollapsedHover = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 255, 136, 0.015) 0%,
    rgba(255, 255, 255, 0.02) 40%,
    rgba(0, 255, 136, 0.01) 100%
  );
  transition: opacity 300ms ease-in-out;

  ${EraPanel}:hover & {
    opacity: 1;
  }
`;

/* ─── Expanded state — full text content ─── */

const ExpandedContent = styled.div<{ $active: boolean }>`
  position: relative;
  z-index: 3;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 100px 80px 80px;
  max-width: 760px;
  opacity: ${p => p.$active ? 1 : 0};
  filter: ${p => p.$active ? 'blur(0)' : 'blur(6px)'};
  transform: ${p => p.$active ? 'translateY(0)' : 'translateY(10px)'};
  pointer-events: ${p => p.$active ? 'auto' : 'none'};
  transition:
    opacity ${PANEL_DURATION} ${PANEL_EASING},
    filter ${PANEL_DURATION} ${PANEL_EASING},
    transform ${PANEL_DURATION} ${PANEL_EASING};
  /* Delay text appearance slightly after panel expands */
  transition-delay: ${p => p.$active ? '150ms' : '0ms'};

  @media (max-width: 1024px) {
    padding: 80px 40px 60px;
  }

  @media (max-width: 768px) {
    padding: 48px 24px 48px;
    height: auto;
  }
`;

const EraEyebrow = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(0, 255, 136, 0.5);
  margin-bottom: 20px;
`;

/* Active era title — large, UnifrakturCook, prominent */
const EraTitle = styled.h2`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(3rem, 6vw, 5.5rem);
  color: rgba(255, 255, 255, 0.92);
  margin: 0 0 36px;
  line-height: 1.05;
  letter-spacing: -0.01em;
`;

const EraBodyText = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  font-weight: 400;
  line-height: 1.85;
  color: rgba(255, 255, 255, 0.55);
  margin: 0 0 24px;

  &:last-child {
    margin-bottom: 0;
  }
`;

/* ─── Active indicator — thin green line at top of panel ─── */
const PanelIndicator = styled.div<{ $active: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  z-index: 5;
  background: #00FF88;
  opacity: ${p => p.$active ? 0.5 : 0};
  transition: opacity ${PANEL_DURATION} ${PANEL_EASING};
`;

/* ═══════════════════════════════════════════════
   SYMBOLS — Horizontal carousel
   ═══════════════════════════════════════════════ */

const CAROUSEL_EASE = 'cubic-bezier(0.4, 0.0, 0.2, 1)';

const SymbolsSection = styled.section`
  padding: 100px 0 80px;
  background: #000000;
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const SymbolsSectionTitle = styled.h2<{ $visible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(3rem, 12vw, 9rem);
  line-height: 1.1;
  letter-spacing: -0.01em;
  margin: 0 0 24px;
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
  opacity: ${p => (p.$visible ? 1 : 0)};
  filter: ${p => (p.$visible ? 'blur(0)' : 'blur(20px)')};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(30px)')};
  transition: all 1.5s ease-out;
`;

const SymbolsSectionSub = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 auto 56px;
  line-height: 1.7;
  text-align: center;
  max-width: 680px;
  padding: 0 24px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 1s ease-out 0.2s;
`;

/* Viewport — clips overflow; all slides positioned inside */
const CarouselViewport = styled.div`
  position: relative;
  width: 100%;
  height: 480px;

  @media (max-width: 768px) {
    height: 340px;
  }
`;

/* Track — flexbox row, translated to center active slide */
const CarouselTrack = styled.div<{ $tx: number }>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  display: flex;
  align-items: center;
  gap: 28px;
  transition: transform 700ms ${CAROUSEL_EASE};
  transform: translateX(${p => p.$tx}px);
  will-change: transform;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

/* Single slide */
const CarouselSlide = styled.div<{ $active: boolean; $dist: number }>`
  flex-shrink: 0;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
  cursor: ${p => p.$active ? 'default' : 'pointer'};

  /* Active = larger; inactive = smaller */
  width: ${p => p.$active ? '440px' : '300px'};
  height: ${p => p.$active ? '440px' : '340px'};

  /* Brightness & opacity fall off with distance */
  filter: brightness(${p => p.$active ? 1.05 : Math.max(0.2, 0.55 - p.$dist * 0.15)});
  opacity: ${p => p.$active ? 1 : Math.max(0.25, 0.75 - p.$dist * 0.2)};

  transition:
    width 700ms ${CAROUSEL_EASE},
    height 700ms ${CAROUSEL_EASE},
    filter 700ms ${CAROUSEL_EASE},
    opacity 700ms ${CAROUSEL_EASE};

  @media (max-width: 1024px) {
    width: ${p => p.$active ? '360px' : '240px'};
    height: ${p => p.$active ? '380px' : '280px'};
  }

  @media (max-width: 768px) {
    width: ${p => p.$active ? '260px' : '160px'};
    height: ${p => p.$active ? '280px' : '200px'};
  }
`;

const SlideImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  user-select: none;
  -webkit-user-drag: none;
`;

/* Subtle glow border — active only */
const SlideGlow = styled.div<{ $active: boolean }>`
  position: absolute;
  inset: -1px;
  border-radius: 5px;
  pointer-events: none;
  opacity: ${p => p.$active ? 1 : 0};
  transition: opacity 700ms ${CAROUSEL_EASE};
  box-shadow:
    0 0 30px rgba(0, 255, 136, 0.08),
    0 0 60px rgba(0, 255, 136, 0.04),
    inset 0 0 1px rgba(0, 255, 136, 0.15);
`;

/* Edge darkening — fade toward screen edges */
const EdgeFade = styled.div<{ $side: 'left' | 'right' }>`
  position: absolute;
  top: 0;
  bottom: 0;
  ${p => p.$side}: 0;
  width: 220px;
  z-index: 2;
  pointer-events: none;
  background: linear-gradient(
    ${p => p.$side === 'left' ? 'to right' : 'to left'},
    #000000 0%,
    rgba(0, 0, 0, 0.65) 35%,
    transparent 100%
  );

  @media (max-width: 768px) {
    width: 60px;
  }
`;

/* Caption — fixed height to prevent jumps */
const CaptionZone = styled.div`
  text-align: center;
  margin-top: 40px;
  padding: 0 24px;
  min-height: 120px;
  position: relative;
`;

/* Each caption slides in/out with a key-based remount */
const CaptionInner = styled.div`
  animation: captionIn 500ms ${CAROUSEL_EASE} both;

  @keyframes captionIn {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CaptionCategory = styled.span`
  display: block;
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(0, 255, 136, 0.5);
  margin-bottom: 10px;
`;

const CaptionTitle = styled.h3`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 10px;
`;

const CaptionDesc = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.45);
  line-height: 1.6;
  max-width: 520px;
  margin: 0 auto;
`;

/* Navigation: arrows + counter */
const CarouselNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 28px;
  margin-top: 28px;
`;

const ArrowBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  outline: none;
  opacity: 0.45;
  transition: opacity 300ms ease-in-out;

  &:hover { opacity: 0.85; }

  svg {
    width: 32px;
    height: 32px;
    stroke: #FFFFFF;
    stroke-width: 1.5;
    fill: none;
  }
`;

const CarouselCounter = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.35);
  letter-spacing: 0.05em;
  min-width: 48px;
  text-align: center;
`;

/* ─── Shared content sections ─── */

const ContentSection = styled.section`
  padding: 80px 16px 0;
  background: #000000;
  position: relative;
  z-index: 1;
`;

const ContentContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const SectionHeading = styled.h2<{ $visible: boolean }>`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(2rem, 5vw, 3.5rem);
  color: #FFFFFF;
  margin: 0 0 16px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  filter: ${p => (p.$visible ? 'blur(0)' : 'blur(12px)')};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 1.2s ease-out;
`;

const SectionSubheading = styled.p<{ $visible: boolean }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 64px;
  line-height: 1.7;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 1s ease-out 0.2s;
`;

const ThinSeparator = styled.hr`
  border: none;
  height: 1px;
  background: rgba(0, 255, 136, 0.15);
  margin: 0;
`;

const SpacerBlock = styled.div`
  height: 80px;
`;

/* ─── Catalogue entries ─── */

const CategoryBlock = styled.div<{ $visible: boolean }>`
  margin-bottom: 80px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(24px)')};
  transition: all 1s ease-out;
  &:last-child { margin-bottom: 0; }
`;

const CategoryTitle = styled.h2`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(1.75rem, 4vw, 3rem);
  color: #00FF88;
  margin: 0 0 12px;
`;

const CategoryDescription = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px;
`;

const EntryList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
`;

const EntryItem = styled.li`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  padding: 14px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  transition: color 0.6s ease-in-out, padding-left 0.6s ease-in-out;
  cursor: default;
  &:last-child { border-bottom: none; }
  &:hover { color: rgba(255, 255, 255, 0.85); padding-left: 8px; }
`;

/* ─── Case files (documents) ─── */

const CaseFile = styled.article<{ $visible: boolean }>`
  padding: 40px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  opacity: ${p => (p.$visible ? 1 : 0)};
  transform: ${p => (p.$visible ? 'translateY(0)' : 'translateY(16px)')};
  transition: all 1s ease-out;
  &:last-child { border-bottom: none; }
`;

const CaseMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 12px;
  flex-wrap: wrap;
`;

const CaseRef = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #00FF88;
  letter-spacing: 0.06em;
`;

const CaseClassification = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.3);
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const CaseStatus = styled.span<{ $status: string }>`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.6875rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 2px 8px;
  border: 1px solid ${p => p.$status.includes('ACTIVE') ? 'rgba(255, 0, 110, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${p => p.$status.includes('ACTIVE') ? '#FF006E' : 'rgba(255, 255, 255, 0.3)'};
`;

const CaseTitle = styled.h3`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 4px;
`;

const CaseDate = styled.span`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.25);
`;

const CaseSummary = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.5);
  margin: 16px 0;
  line-height: 1.6;
`;

const FindingsLabel = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.25);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  margin: 20px 0 12px;
`;

const Finding = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.9375rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.7;
  margin: 0 0 12px;
  padding-left: 16px;
  border-left: 2px solid rgba(0, 255, 136, 0.1);
  &:last-child { margin-bottom: 0; }
`;

const CaseNotes = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.3);
  line-height: 1.6;
  margin: 20px 0 0;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
`;

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */

const Archive: React.FC = () => {
  useDocumentMeta({
    title: "Archive — R'LYEH ARCHIVE",
    description:
      'Classified chronology, recovered symbols, catalogued artifacts, and case files documenting contact with the entity that sleeps beneath the ocean.',
  });

  const { ref: heroRef, isIntersecting: heroVisible } = useIntersection({ threshold: 0.1 });
  const { ref: symRef, isIntersecting: symVisible } = useIntersection({ threshold: 0.05 });
  const { ref: catRef, isIntersecting: catVisible } = useIntersection({ threshold: 0.05 });
  const { ref: docsRef, isIntersecting: docsVisible } = useIntersection({ threshold: 0.05 });

  /* ─── Chronology — exactly one era active at all times ─── */
  const [activeEra, setActiveEra] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  const handlePanelClick = useCallback((index: number) => {
    if (index === activeEra || isTransitioning) return;
    setIsTransitioning(true);
    setActiveEra(index);
    transitionTimeout.current = setTimeout(() => {
      setIsTransitioning(false);
    }, 850);
  }, [activeEra, isTransitioning]);

  /* ─── Symbols carousel — cyclic ─── */
  const [activeSymbol, setActiveSymbol] = useState(0);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const onResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const goToSymbol = useCallback((index: number) => {
    const next = ((index % SYMBOLS.length) + SYMBOLS.length) % SYMBOLS.length;
    setActiveSymbol(next);
  }, []);

  /* Calculate horizontal offset so the active slide is centered.
     Constants must mirror the CSS breakpoints in CarouselSlide. */
  const getTrackTx = useCallback(() => {
    let slideWActive: number, slideWInactive: number, slideGap: number;
    if (windowWidth <= 768) {
      slideWActive = 260; slideWInactive = 160; slideGap = 16;
    } else if (windowWidth <= 1024) {
      slideWActive = 360; slideWInactive = 240; slideGap = 28;
    } else {
      slideWActive = 440; slideWInactive = 300; slideGap = 28;
    }
    let px = 0;
    for (let i = 0; i < activeSymbol; i++) {
      px += slideWInactive + slideGap;
    }
    px += slideWActive / 2;
    return -px;
  }, [activeSymbol, windowWidth]);

  return (
    <Page>
      <Header />

      {/* ─── Hero — fullscreen video ─── */}
      <HeroSection ref={heroRef}>
        <HeroBgVideo autoPlay loop muted playsInline preload="metadata" poster={`${PUBLIC}/Images/archive_hero_bg.webp`} aria-hidden="true">
          <source src={ARCHIVE_VIDEO} type="video/mp4" />
        </HeroBgVideo>
        <HeroDarkOverlay />
        <HeroBottomFade />
        <HeroContent>
          <HeroTitle $visible={heroVisible}>Archive</HeroTitle>
        </HeroContent>
      </HeroSection>

      {/* ─── Chronology — expanding panel system ─── */}
      <ChronoSection>
        {ERAS.map((era, i) => {
          const isActive = activeEra === i;
          return (
            <EraPanel
              key={era.id}
              $active={isActive}
              role="button"
              tabIndex={0}
              aria-expanded={isActive}
              aria-label={`Era ${era.number}: ${era.label}`}
              onClick={() => handlePanelClick(i)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handlePanelClick(i);
                }
              }}
            >
              {/* Background image — own per panel */}
              <PanelBg $url={ERA_IMAGES[i]} $active={isActive} />
              <PanelOverlay $active={isActive} />
              <PanelGreenGlow $active={isActive} />
              <PanelBottomFade />
              <PanelGrain />
              <PanelIndicator $active={isActive} />
              <CollapsedHover />

              {/* Collapsed view — vertical label + number */}
              <CollapsedContent $active={isActive}>
                <CollapsedLabel>{era.label}</CollapsedLabel>
                <CollapsedNumber>{era.number}</CollapsedNumber>
              </CollapsedContent>

              {/* Expanded view — full text */}
              <ExpandedContent $active={isActive}>
                <EraEyebrow>Era {era.number} — Chronological Record</EraEyebrow>
                <EraTitle>{era.title}</EraTitle>
                {era.body.map((paragraph, j) => (
                  <EraBodyText key={j}>{paragraph}</EraBodyText>
                ))}
              </ExpandedContent>
            </EraPanel>
          );
        })}
      </ChronoSection>

      {/* ─── Symbols carousel ─── */}
      <SymbolsSection ref={symRef} id="symbols">
        <SymbolsSectionTitle $visible={symVisible}>Symbols</SymbolsSectionTitle>
        <SymbolsSectionSub $visible={symVisible}>
          Glyphs and sigils recovered from R'lyeh stone tablets, cult artifacts,
          and dream transcriptions. Each symbol carries a fragment of meaning
          that resists rational interpretation.
        </SymbolsSectionSub>

        <CarouselViewport>
          <EdgeFade $side="left" />
          <EdgeFade $side="right" />

          <CarouselTrack $tx={getTrackTx()}>
            {SYMBOLS.map((sym, i) => {
              const isActive = activeSymbol === i;
              const dist = Math.abs(activeSymbol - i);
              return (
                <CarouselSlide
                  key={sym.id}
                  $active={isActive}
                  $dist={dist}
                  role="button"
                  tabIndex={0}
                  aria-label={`View symbol: ${sym.title}`}
                  aria-pressed={isActive}
                  onClick={() => goToSymbol(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      goToSymbol(i);
                    }
                  }}
                >
                  <SlideImage src={sym.image} alt={sym.title} loading="lazy" />
                  <SlideGlow $active={isActive} />
                </CarouselSlide>
              );
            })}
          </CarouselTrack>
        </CarouselViewport>

        {/* Caption — key forces re-mount animation per symbol */}
        <CaptionZone>
          <CaptionInner key={activeSymbol}>
            <CaptionCategory>Symbol</CaptionCategory>
            <CaptionTitle>{SYMBOLS[activeSymbol].title}</CaptionTitle>
            <CaptionDesc>{SYMBOLS[activeSymbol].description}</CaptionDesc>
          </CaptionInner>
        </CaptionZone>

        {/* Navigation: cyclic arrows + counter */}
        <CarouselNav>
          <ArrowBtn onClick={() => goToSymbol(activeSymbol - 1)} aria-label="Previous symbol">
            <svg viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" /></svg>
          </ArrowBtn>
          <CarouselCounter>{activeSymbol + 1} / {SYMBOLS.length}</CarouselCounter>
          <ArrowBtn onClick={() => goToSymbol(activeSymbol + 1)} aria-label="Next symbol">
            <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
          </ArrowBtn>
        </CarouselNav>
      </SymbolsSection>

      <SpacerBlock />

      {/* ─── Catalogue ─── */}
      <ContentSection ref={catRef}>
        <ContentContainer>
          <SectionHeading $visible={catVisible}>Catalogue</SectionHeading>
          <SectionSubheading $visible={catVisible}>
            Indexed entries across three domains of recovered material.
            Each record has been verified by at least two independent sources.
          </SectionSubheading>
          <ThinSeparator />
          <SpacerBlock />
          {categoryData.map((cat, i) => (
            <CategoryBlock key={cat.id} $visible={catVisible} style={{ transitionDelay: `${i * 0.15}s` }}>
              <CategoryTitle id={cat.id}>{cat.title}</CategoryTitle>
              <CategoryDescription>{cat.description}</CategoryDescription>
              <EntryList>
                {cat.entries.map((entry, j) => (
                  <EntryItem key={j}>{entry}</EntryItem>
                ))}
              </EntryList>
            </CategoryBlock>
          ))}
        </ContentContainer>
      </ContentSection>

      <SpacerBlock />

      {/* ─── Documents ─── */}
      <ContentSection ref={docsRef} id="documents">
        <ContentContainer>
          <SectionHeading $visible={docsVisible}>Documents</SectionHeading>
          <SectionSubheading $visible={docsVisible}>
            Classified case files and field reports documenting verified instances
            of anomalous influence. Access restricted.
          </SectionSubheading>
          <ThinSeparator />
          {caseFiles.map((cf, i) => (
            <CaseFile key={cf.id} $visible={docsVisible} style={{ transitionDelay: `${i * 0.15}s` }}>
              <CaseMeta>
                <CaseRef>{cf.reference}</CaseRef>
                <CaseClassification>{cf.classification}</CaseClassification>
                <CaseStatus $status={cf.status}>{cf.status}</CaseStatus>
              </CaseMeta>
              <CaseTitle>{cf.title}</CaseTitle>
              <CaseDate>{cf.date} · {cf.location}</CaseDate>
              <CaseSummary>{cf.summary}</CaseSummary>
              <FindingsLabel>Findings</FindingsLabel>
              {cf.findings.map((f, j) => (
                <Finding key={j}>{f}</Finding>
              ))}
              <CaseNotes>
                <strong style={{ color: 'rgba(255, 255, 255, 0.35)' }}>Archivist notes: </strong>
                {cf.notes}
              </CaseNotes>
            </CaseFile>
          ))}
        </ContentContainer>
      </ContentSection>

      <SpacerBlock />
      <Footer />
    </Page>
  );
};

export default Archive;
