import styled from 'styled-components';

interface ButtonProps {
  $variant?: 'primary' | 'secondary' | 'tertiary';
  $size?: 'sm' | 'md' | 'lg';
}

export const Button = styled.button.attrs<ButtonProps>((props) => ({
  // Фільтруємо props щоб не передавати їх в DOM
}))<ButtonProps>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => {
    switch (props.$size) {
      case 'sm': return '8px 18px';
      case 'lg': return '12px 28px';
      default: return '10px 24px';
    }
  }};
  min-width: ${props => {
    switch (props.$size) {
      case 'sm': return '140px';
      case 'lg': return '200px';
      default: return '170px';
    }
  }};
  
  background: transparent;
  color: rgba(255, 255, 255, 0.95);
  text-decoration: none;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 0;
  font-weight: 600;
  font-family: 'Univa Nova', sans-serif;
  font-style: normal;
  font-size: ${props => {
    switch (props.$size) {
      case 'sm': return '1.0625rem';
      case 'lg': return '1.25rem';
      default: return '1.125rem';
    }
  }};
  cursor: pointer;
  overflow: hidden;
  transition: font-family 0.55s cubic-bezier(0.25, 0.1, 0.25, 1),
              transform 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
              background 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
              color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
              border-color 0.35s cubic-bezier(0.25, 0.1, 0.25, 1),
              box-shadow 0.35s cubic-bezier(0.25, 0.1, 0.25, 1);
  
  &:hover {
    background: var(--color-accent);
    color: var(--color-bg);
    border-color: var(--color-accent);
    font-family: var(--font-heading);
    box-shadow: var(--glow-sm);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
