import { ReactNode } from 'react';

interface MobileShellProps {
  children: ReactNode;
}

export function MobileShell({ children }: MobileShellProps) {
  // Mobile shell implementation will be added here
  // This provides mobile navigation and layout
  return (
    <div className="mobile-shell">
      <main className="mobile-content">
        {children}
      </main>
      {/* Mobile navigation will be added here */}
    </div>
  );
}
