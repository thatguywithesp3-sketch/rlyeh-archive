import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled, { css } from 'styled-components';

/* Semantically this is the site's primary navigation — use <header>.
   Visually it sits at the bottom of the viewport (fixed, bottom: 0),
   which is a deliberate design choice for the aesthetic. */
const HeaderContainer = styled.header`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.5) 25%,
    rgba(0, 0, 0, 0.25) 45%,
    rgba(0, 0, 0, 0.1) 65%,
    rgba(0, 0, 0, 0.03) 80%,
    transparent 100%
  );
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 0 50px;
  min-height: 72px;
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  gap: 24px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 0 20px;
  }
`;

const Logo = styled(Link)`
  align-self: center;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s ease;

  img {
    height: 36px;
    width: auto;
  }

  &:hover {
    filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.5));
    transform: scale(1.05);
  }
`;

/* Desktop: flex row centred in the nav bar.
   Mobile: fullscreen overlay that slides up when open. */
const NavLinks = styled.div<{ $isOpen: boolean }>`
  display: flex;
  gap: 32px;
  align-items: stretch;
  flex: 1;
  justify-content: center;

  @media (max-width: 768px) {
    position: fixed;
    inset: 0;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 40px;
    background: #000000;
    z-index: 999;
    opacity: ${props => (props.$isOpen ? 1 : 0)};
    visibility: ${props => (props.$isOpen ? 'visible' : 'hidden')};
    transform: ${props => (props.$isOpen ? 'translateY(0)' : 'translateY(20px)')};
    transition: opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease;
  }
`;

const NavLink = styled(Link)<{ $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => (props.$isActive ? '#00FF88' : 'rgba(255, 255, 255, 0.7)')};
  text-decoration: none;
  font-family: ${props =>
    props.$isActive ? "'UnifrakturCook', serif" : "'Univa Nova', sans-serif"};
  font-size: ${props => (props.$isActive ? '1.875rem' : '1.5rem')};
  font-weight: ${props => (props.$isActive ? 700 : 400)};
  padding: 0 24px;
  min-height: 100%;
  background: ${props =>
    props.$isActive
      ? 'linear-gradient(to top, rgba(0, 255, 136, 0.18) 0%, rgba(0, 255, 136, 0.05) 50%, transparent 100%)'
      : 'transparent'};
  border-bottom: ${props =>
    props.$isActive ? '2px solid #00FF88' : '2px solid transparent'};
  transition: all 0.3s ease;
  position: relative;
  box-sizing: border-box;

  &:hover {
    color: #00FF88;
  }

  @media (max-width: 768px) {
    font-size: ${props => (props.$isActive ? '3rem' : '2.25rem')};
    padding: 16px 32px;
    min-height: auto;
    background: transparent;
    border-bottom: none;
  }
`;

const ContactIcon = styled(Link)`
  flex-shrink: 0;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  color: #00FF88;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1000;

  &:hover {
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(0, 255, 136, 0.6));
  }

  svg {
    width: 100%;
    height: 100%;
    stroke: currentColor;
    fill: none;
  }
`;

/* Hidden on desktop; 3-bar hamburger → X on mobile */
const HamburgerButton = styled.button<{ $isOpen: boolean }>`
  align-self: center;
  background: transparent;
  border: none;
  cursor: pointer;
  width: 32px;
  height: 32px;
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1000;
  padding: 0;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 6px;
    width: 20px;
    height: 2px;
    border-radius: 1px;
    transform-origin: center;
    transition: all 0.3s ease;
  }

  ${props =>
    props.$isOpen
      ? css`
          &::before {
            background: #00ff88;
            top: 50%;
            margin-top: -1px;
            transform: rotate(45deg);
            box-shadow: none;
          }
          &::after {
            background: #00ff88;
            top: 50%;
            margin-top: -1px;
            transform: rotate(-45deg);
            box-shadow: none;
          }
        `
      : css`
          &::before {
            background: #ffffff;
            top: 8px;
            box-shadow: 0 7px 0 #ffffff, 0 14px 0 #ffffff;
          }
          &::after {
            display: none;
          }
          &:hover::before {
            background: #00ff88;
            box-shadow: 0 7px 0 #00ff88, 0 14px 0 #00ff88;
          }
        `}

  @media (max-width: 768px) {
    display: flex;
  }
`;

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const navLinksRef = useRef<HTMLDivElement>(null);
  const menuEverOpenedRef = useRef(false);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const closeMenu = () => setIsMenuOpen(false);

  // Focus management: move focus into/out of mobile menu
  useEffect(() => {
    if (isMenuOpen) {
      menuEverOpenedRef.current = true;
      const first = navLinksRef.current?.querySelector<HTMLElement>('a');
      first?.focus();
    } else if (menuEverOpenedRef.current) {
      hamburgerRef.current?.focus();
    }
  }, [isMenuOpen]);

  // Escape key closes menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  return (
    <HeaderContainer>
      <Nav>
        <Logo to="/" onClick={closeMenu}>
          <img
            src={`${process.env.PUBLIC_URL || ''}/elder sign.svg`}
            alt="R'LYEH ARCHIVE"
          />
        </Logo>

        <NavLinks $isOpen={isMenuOpen} ref={navLinksRef} id="mobile-nav">
          <NavLink to="/" $isActive={isActive('/')} onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink
            to="/archive"
            $isActive={isActive('/archive')}
            onClick={closeMenu}
          >
            Archive
          </NavLink>
          <NavLink
            to="/challenge"
            $isActive={isActive('/challenge')}
            onClick={closeMenu}
          >
            Challenge
          </NavLink>
        </NavLinks>

        <ContactIcon to="/contact" aria-label="Contact" onClick={closeMenu}>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </ContactIcon>

        <HamburgerButton
          ref={hamburgerRef}
          $isOpen={isMenuOpen}
          onClick={() => setIsMenuOpen(prev => !prev)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-nav"
        />
      </Nav>
    </HeaderContainer>
  );
};
