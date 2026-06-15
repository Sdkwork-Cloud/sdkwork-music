import { BrowserRouter } from 'react-router-dom';
import { AuthGate } from './AuthGate';
import { AppProviders } from './providers/AppProviders';
import { MobileShell } from './shell/MobileShell';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AuthGate>
          <MobileShell>
            <HomePage />
          </MobileShell>
        </AuthGate>
      </AppProviders>
    </BrowserRouter>
  );
}
