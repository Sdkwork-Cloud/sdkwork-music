import { MusicHomeShelf } from '../../types/music';
import { ShelfItem } from './ShelfItem';

interface ShelfListProps {
  shelves: MusicHomeShelf[];
}

export function ShelfList({ shelves }: ShelfListProps) {
  if (shelves.length === 0) {
    return <div className="empty-shelves">No recommendations available</div>;
  }

  return (
    <div className="shelf-list">
      {shelves.map((shelf) => (
        <ShelfItem key={shelf.id} shelf={shelf} />
      ))}
    </div>
  );
}
