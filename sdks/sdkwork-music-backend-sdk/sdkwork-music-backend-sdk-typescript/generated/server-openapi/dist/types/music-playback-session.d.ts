export interface MusicPlaybackSession {
    id: string;
    tenantId: string;
    userId: string;
    deviceId: string;
    currentTrackId?: string;
    queue?: string[];
    positionMs?: number;
    playbackState: 'idle' | 'playing' | 'paused' | 'buffering' | 'ended';
    updatedAt?: string;
}
//# sourceMappingURL=music-playback-session.d.ts.map