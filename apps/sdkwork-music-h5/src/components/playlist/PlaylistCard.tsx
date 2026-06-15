import { MusicPlaylist } from '../../types/music';

interface PlaylistCardProps {
  playlist: MusicPlaylist;
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <div className="playlist-card">
      <div className="playlist-cover">
        <div className="playlist-cover-placeholder">
          <span>♫</span>
        </div>
      </div>
      <div className="playlist-info">
        <h3 className="playlist-title">{playlist.title}</h3>
        {playlist.description && (
          <p className="playlist-description">{playlist.description}</p>
        )}
        {playlist.trackIds && (
          <p className="playlist-track-count">
            {playlist.trackIds.length} tracks
          </p>
        )}
      </div>
    </div>
  );
}
