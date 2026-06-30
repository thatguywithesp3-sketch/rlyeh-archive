import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer<{ $transparentBg?: boolean }>`
  padding: 64px 12px 32px;
  position: relative;
  isolation: isolate;
  border-top: ${props => props.$transparentBg ? 'none' : '1px solid rgba(0, 255, 136, 0.1)'};
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

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 48px;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FooterTitle = styled.h3`
  font-family: 'UnifrakturCook', serif;
  font-weight: 600;
  font-size: 1.125rem;
  color: #FFFFFF;
  margin-bottom: 8px;
`;

const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.6;
  transition: all 0.3s ease;
  
  &:hover {
    color: #00FF88;
    transform: translateX(4px);
  }
`;

const Copyright = styled.div`
  max-width: 1200px;
  margin: 48px auto 0;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  color: rgba(255, 255, 255, 0.3);
  font-family: 'Univa Nova', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
`;

export const Footer: React.FC<{ transparentBg?: boolean }> = ({ transparentBg }) => {
  return (
    <FooterContainer $transparentBg={transparentBg}>
      <BackgroundLayer $transparentBg={transparentBg} aria-hidden="true" />
      <ContentWrapper>
        <FooterContent>
          <FooterSection>
            <FooterTitle>R'LYEH ARCHIVE</FooterTitle>
            <p style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.875rem', fontFamily: "'Univa Nova', sans-serif" }}>
              Archive of cosmic phenomena and ancient entities
            </p>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Navigation</FooterTitle>
            <FooterLink to="/">Home</FooterLink>
            <FooterLink to="/archive">Archive</FooterLink>
            <FooterLink to="/challenge">Challenge</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Research</FooterTitle>
            <FooterLink to="/#about">About Cthulhu</FooterLink>
            <FooterLink to="/#impact">Impact cases</FooterLink>
            <FooterLink to="/#interaction">Interaction methods</FooterLink>
          </FooterSection>
          <FooterSection>
            <FooterTitle>Contact</FooterTitle>
            <FooterLink to="/contact">Submit testimony</FooterLink>
            <FooterLink to="/contact">Submit report</FooterLink>
          </FooterSection>
        </FooterContent>
        <Copyright>
          © 2025 R'LYEH ARCHIVE. All rights reserved.
        </Copyright>
      </ContentWrapper>
    </FooterContainer>
  );
};
