import { MusicTrack } from '../../types/music';

interface TrackCardProps {
  track: MusicTrack;
}

export function TrackCard({ track }: TrackCardProps) {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="track-card">
      <div className="track-cover">
        {track.audio?.driveUri ? (
          <img src={track.audio.driveUri} alt={track.title} />
        ) : (
          <div className="track-cover-placeholder">
            <span>♪</span>
          </div>
        )}
      </div>
      <div className="track-info">
        <h3 className="track-title">{track.title}</h3>
        <p className="track-artist">{track.artistName || 'Unknown Artist'}</p>
        {track.albumTitle && (
          <p className="track-album">{track.albumTitle}</p>
        )}
      </div>
      <div className="track-meta">
        <span className="track-duration">{formatDuration(track.durationSeconds)}</span>
        <span className="track-status">{track.status}</span>
      </div>
    </div>
  );
}
