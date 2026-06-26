import React from 'react';
import styled from 'styled-components';

const StyledButton = styled.button<{ $isActive: boolean; $isExpanded: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 8px 15px;
  font-family: var(--font-body);
  font-style: normal;
  font-size: 1.125rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  border: none;
  background: transparent;
  cursor: pointer;
  box-sizing: border-box;

  /* Show/hide based on active state */
  max-height: ${p => (p.$isActive ? '48px' : '0')};
  opacity: ${p => (p.$isActive ? 1 : 0)};
  overflow: hidden;

  transition:
    max-height  0.55s cubic-bezier(0.25, 0.1, 0.25, 1),
    opacity     0.55s cubic-bezier(0.25, 0.1, 0.25, 1),
    font-family 0.55s cubic-bezier(0.25, 0.1, 0.25, 1),
    background  0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
    color       0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
    box-shadow  0.35s cubic-bezier(0.25, 0.1, 0.25, 1);

  &:hover {
    font-family: var(--font-heading);
    background: var(--color-accent);
    color: var(--color-bg);
    box-shadow: var(--glow-sm);

    svg {
      transform: ${p =>
        p.$isExpanded ? 'rotate(-90deg) translateX(0)' : 'translateX(0)'};
      filter: drop-shadow(0 0 4px rgba(0, 255, 136, 0.5));
      color: var(--color-bg);
    }
  }

  svg {
    flex-shrink: 0;
    margin-left: auto;
    transform: ${p =>
      p.$isExpanded ? 'rotate(-90deg) translateX(-70%)' : 'translateX(-70%)'};
    transition:
      transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1),
      filter    0.55s cubic-bezier(0.25, 0.1, 0.25, 1),
      color     0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
    color: inherit;
  }
`;

const ArrowIcon: React.FC = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

interface TellMeMoreButtonProps {
  isActive?: boolean;
  isExpanded: boolean;
  onToggle: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}

export const TellMeMoreButton: React.FC<TellMeMoreButtonProps> = ({
  isActive = true,
  isExpanded,
  onToggle,
  className,
}) => (
  <StyledButton
    $isActive={isActive}
    $isExpanded={isExpanded}
    type="button"
    onClick={onToggle}
    className={className}
    aria-expanded={isExpanded}
  >
    {isExpanded ? 'Tell me less' : 'Tell me more'} <ArrowIcon />
  </StyledButton>
);
