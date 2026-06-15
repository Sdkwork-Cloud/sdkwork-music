import { MusicHomeShelf } from '../../types/music';
import { TrackCard } from '../track/TrackCard';
import { PlaylistCard } from '../playlist/PlaylistCard';

interface ShelfItemProps {
  shelf: MusicHomeShelf;
}

export function ShelfItem({ shelf }: ShelfItemProps) {
  return (
    <div className="shelf-item">
      <div className="shelf-header">
        <h2 className="shelf-title">{shelf.title}</h2>
        <span className="shelf-type">{shelf.shelfType}</span>
      </div>
      <div className="shelf-content">
        {shelf.items.map((item) => (
          <div key={item.id} className="shelf-item-card">
            {item.itemType === 'track' && item.track && (
              <TrackCard track={item.track} />
            )}
            {item.itemType === 'playlist' && item.playlist && (
              <PlaylistCard playlist={item.playlist} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
