import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { Header } from '../components/Layout/Header';
import { HeroAboutSection } from '../components/Hero/HeroAboutSection';
import { TimelineSection } from '../components/Sections/TimelineSection';
import { ImpactCases } from '../components/Sections/ImpactCases';
import { InteractionMethods } from '../components/Sections/InteractionMethods';
import { Warnings } from '../components/Sections/Warnings';
import { ArchiveFooterFrame } from '../components/Layout/ArchiveFooterFrame';
import { IntroScreen } from '../components/IntroScreen';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const PageContainer = styled.div<{ $visible: boolean }>`
  min-height: 100vh;
  background: transparent;
  padding-bottom: 100px;
  opacity: ${p => (p.$visible ? 1 : 0)};
  transition: opacity 1s ease-out;
`;

/* Anchor target for in-page navigation (footer links, deep-links). */
const Anchor = styled.div`
  scroll-margin-top: 90px;
`;

const INTRO_SHOWN_KEY = 'rlyeh_intro_shown';

const Home: React.FC = () => {
  useDocumentMeta({
    title: "R'LYEH ARCHIVE — Cthulhu Research",
    description:
      "A research archive of cosmic phenomena and ancient entities. Cthulhu research, classified case files, symbols, and dream-contact records.",
  });

  /* Show intro only on first visit per session (not on in-app navigation) */
  const alreadyShown = sessionStorage.getItem(INTRO_SHOWN_KEY) === '1';
  const [introComplete, setIntroComplete] = useState(alreadyShown);

  const handleIntroComplete = useCallback(() => {
    sessionStorage.setItem(INTRO_SHOWN_KEY, '1');
    setIntroComplete(true);
  }, []);

  return (
    <>
      {!introComplete && <IntroScreen onComplete={handleIntroComplete} />}
      <PageContainer $visible={introComplete}>
        <Header />
        <Anchor id="about">
          <HeroAboutSection />
        </Anchor>
        <Anchor id="timeline">
          <TimelineSection />
        </Anchor>
        <Anchor id="impact">
          <ImpactCases />
        </Anchor>
        <Anchor id="interaction">
          <InteractionMethods />
        </Anchor>
        <Anchor id="warnings">
          <Warnings />
        </Anchor>
        <Anchor id="archive">
          <ArchiveFooterFrame />
        </Anchor>
      </PageContainer>
    </>
  );
};

export default Home;
