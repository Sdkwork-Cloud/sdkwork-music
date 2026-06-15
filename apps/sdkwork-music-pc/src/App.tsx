import { BrowserRouter } from 'react-router-dom';
import { AuthGate } from './AuthGate';
import { AppProviders } from './providers/AppProviders';
import { HomePage } from './pages/HomePage';
import { PlayerBar } from './components/player/PlayerBar';

export default function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <AuthGate>
          <div className="app-layout">
            <main className="app-main">
              <HomePage />
            </main>
            <PlayerBar />
          </div>
        </AuthGate>
      </AppProviders>
    </BrowserRouter>
  );
}
