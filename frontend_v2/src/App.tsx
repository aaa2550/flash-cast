import React from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyle, theme } from './styles/theme';
import LoginScreen from './screens/LoginScreen';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LoginScreen />
    </ThemeProvider>
  );
}

export default App;
