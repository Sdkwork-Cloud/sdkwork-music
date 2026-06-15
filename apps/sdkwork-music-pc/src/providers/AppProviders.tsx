import { ReactNode } from 'react';
import { PlayerProvider } from './PlayerProvider';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <PlayerProvider>
      {children}
    </PlayerProvider>
  );
}
