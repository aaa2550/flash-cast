import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    bgDeep: '#0a0a1a',
    bg: '#121224',
    bgSlight: '#1a1a30',
    primary: '#00f6ff',
    secondary: '#ff00e5',
    text: '#e0e0ff',
    textSecondary: '#a0a0c0',
    border: '#333366',
    success: '#00ffaa',
    error: '#ff3366',
    white: '#ffffff',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
  },
  typography: {
    fontFamily: "'Roboto Mono', 'Courier New', monospace",
    h1: '2.5rem',
    h2: '2rem',
    body: '1rem',
  },
  shadows: {
    glow: '0 0 15px rgba(0, 246, 255, 0.5)',
  }
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;700&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    background-color: ${theme.colors.bgDeep};
    color: ${theme.colors.text};
    font-family: ${theme.typography.fontFamily};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  #root {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }
`;
