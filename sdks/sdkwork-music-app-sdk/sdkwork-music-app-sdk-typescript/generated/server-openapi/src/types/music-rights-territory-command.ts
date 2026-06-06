export interface MusicRightsTerritoryCommand {
  regionCode: string;
  availability: 'allowed' | 'blocked' | 'windowed';
  startsAt?: string;
  endsAt?: string;
}
