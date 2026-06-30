import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useDocumentMeta } from '../hooks/useDocumentMeta';

const Page = styled.div`
  min-height: 100vh;
  background: #000000;
  position: relative;
  padding-bottom: 120px;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: clamp(160px, 26vh, 280px) 24px clamp(60px, 10vh, 120px);
`;

const Code = styled.p`
  font-family: 'Univa Nova', monospace;
  font-size: 0.875rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: rgba(0, 255, 136, 0.5);
  margin-bottom: 24px;
`;

const Title = styled.h1`
  font-family: 'UnifrakturCook', serif;
  font-weight: 700;
  font-size: clamp(3rem, 13vw, 8rem);
  line-height: 1.05;
  margin: 0 0 24px;
  background: linear-gradient(
    to bottom,
    #ffffff 0%,
    rgba(200, 200, 200, 0.7) 40%,
    rgba(80, 80, 80, 0.2) 75%,
    transparent 95%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Message = styled.p`
  font-family: 'Univa Nova', sans-serif;
  font-size: clamp(1rem, 2vw, 1.2rem);
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.5);
  max-width: 520px;
  margin: 0 auto 40px;
`;

const HomeLink = styled(Link)`
  font-family: 'Univa Nova', sans-serif;
  font-size: 1.0625rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  border: 2px solid rgba(0, 255, 136, 0.5);
  padding: 12px 32px;
  transition: font-family 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
    background 0.35s ease, color 0.35s ease, border-color 0.35s ease,
    box-shadow 0.35s ease;

  &:hover {
    background: #00ff88;
    color: #000000;
    border-color: #00ff88;
    font-family: 'UnifrakturCook', serif;
    box-shadow: 0 0 20px rgba(0, 255, 136, 0.4),
      0 0 40px rgba(0, 255, 136, 0.2);
  }
`;

const NotFound: React.FC = () => {
  useDocumentMeta({
    title: "Record Not Found — R'LYEH ARCHIVE",
    description: 'This fragment of the Archive has sunk beyond recovery.',
  });

  return (
  <Page>
    <Header />
    <Main>
      <Code>Record not found</Code>
      <Title>Lost to the Deep</Title>
      <Message>
        This fragment of the Archive has sunk beyond recovery — or never
        surfaced at all. The path you followed leads only to dark water.
      </Message>
      <HomeLink to="/">Return to the surface</HomeLink>
    </Main>
    <Footer />
  </Page>
  );
};

export default NotFound;
