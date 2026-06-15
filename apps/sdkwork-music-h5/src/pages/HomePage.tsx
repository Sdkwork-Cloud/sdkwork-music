import { useEffect, useState } from 'react';
import { MusicHomeShelf } from '../types/music';
import { musicService } from '../services/musicService';
import { ShelfList } from '../components/shelf/ShelfList';

export function HomePage() {
  const [shelves, setShelves] = useState<MusicHomeShelf[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadShelves();
  }, []);

  async function loadShelves() {
    try {
      setLoading(true);
      setError(null);
      const data = await musicService.getHomeShelves();
      setShelves(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load shelves');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <p>{error}</p>
        <button onClick={loadShelves}>Retry</button>
      </div>
    );
  }

  return (
    <div className="home-page">
      <h1>Welcome to SDKWork Music</h1>
      <ShelfList shelves={shelves} />
    </div>
  );
}
