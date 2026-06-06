export interface MusicAiGenerationCreditLedgerEntry {
    id: string;
    tenantId: string;
    userId: string;
    taskId?: string;
    direction: 'credit' | 'debit' | 'refund';
    amount: number;
    balanceAfter: number;
    reasonCode: string;
    createdAt: string;
}
//# sourceMappingURL=music-ai-generation-credit-ledger-entry.d.ts.map