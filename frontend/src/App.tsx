import { ChakraProvider, theme } from '@chakra-ui/react';
import AppRouter from './components/AppRouter';

export const App = () => (
  <ChakraProvider theme={theme}>
    <AppRouter />
  </ChakraProvider>
);
