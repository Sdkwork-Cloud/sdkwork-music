export interface MusicModerationSignal {
  id: string;
  tenantId: string;
  resourceType: string;
  resourceId: string;
  signalType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'reviewing' | 'resolved' | 'dismissed';
  reason?: string;
  createdAt?: string;
}
