import { describe, expect, it } from 'vitest';
import { createDefaultSdkworkGenerationAssetConfig } from '../src/generation-asset-config';

describe('@sdkwork/music-pc-generation MusicGenerationPanel', () => {
  it('exports a panel component', async () => {
    const module = await import('../src/react.ts');
    expect(module.MusicGenerationPanel).toBeTypeOf('function');
  });

  it('defaults music duration from shared asset config', () => {
    const config = createDefaultSdkworkGenerationAssetConfig('music');
    expect(config.durationSeconds).toBe(30);
  });
});
