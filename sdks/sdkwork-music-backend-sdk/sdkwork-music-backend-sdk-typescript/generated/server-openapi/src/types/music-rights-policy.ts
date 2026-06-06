export interface MusicRightsPolicy {
  id: string;
  tenantId: string;
  policyCode: string;
  title: string;
  licenseType: 'platform' | 'creator_owned' | 'licensed' | 'public_domain' | 'restricted';
  usageScope: string;
  attributionRequired?: boolean;
  commercialUseAllowed?: boolean;
  status: 'draft' | 'active' | 'archived';
}
