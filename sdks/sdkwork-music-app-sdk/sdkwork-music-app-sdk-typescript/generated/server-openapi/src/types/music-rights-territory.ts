export interface MusicRightsTerritory {
  id: string;
  tenantId: string;
  rightsPolicyId: string;
  regionCode: string;
  availability: 'allowed' | 'blocked' | 'windowed';
  startsAt?: string;
  endsAt?: string;
}
