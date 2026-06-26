export const theme = {
  colors: {
    background: {
      primary: '#000000',
      secondary: '#0A0A0A',
      tertiary: '#0F1419',
    },
    accent: {
      primary: '#00FF88',
      secondary: '#00D4FF',
      tertiary: '#7B2CBF',
      special: '#FF006E',
    },
    ocean: {
      deep: '#003D5B',
      medium: '#006494',
      dark: '#13293D',
      light: '#1B98E0',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.9)',
      tertiary: 'rgba(255, 255, 255, 0.7)',
      muted: 'rgba(255, 255, 255, 0.5)',
    },
  },
  typography: {
    fonts: {
      heading: '"UnifrakturCook", serif',
      body: '"Univa Nova", sans-serif',
      mono: '"Univa Nova", monospace',
    },
    fontStyle: {
      normal: 'normal',
    },
    sizes: {
      h1: { desktop: '4.5rem', mobile: '2.5rem' },
      h2: { desktop: '3.5rem', mobile: '2rem' },
      h3: { desktop: '2.5rem', mobile: '1.75rem' },
      body: '1rem',
      small: '0.875rem',
    },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
    huge: '80px',
  },
  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '32px',
    full: '9999px',
  },
  shadows: {
    sm: '0 2px 8px rgba(0, 255, 136, 0.1)',
    md: '0 4px 16px rgba(0, 255, 136, 0.2)',
    lg: '0 8px 32px rgba(0, 255, 136, 0.3)',
    glow: '0 0 40px rgba(0, 255, 136, 0.5)',
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },
};
