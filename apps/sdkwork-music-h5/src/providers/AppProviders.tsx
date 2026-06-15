import { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <>
      {/* Add providers here as needed */}
      {children}
    </>
  );
}
