export interface MusicRightsPolicyCommand {
    policyCode: string;
    title: string;
    licenseType: 'platform' | 'creator_owned' | 'licensed' | 'public_domain' | 'restricted';
    usageScope: string;
    attributionRequired?: boolean;
    commercialUseAllowed?: boolean;
    status: 'draft' | 'active' | 'archived';
}
//# sourceMappingURL=music-rights-policy-command.d.ts.map