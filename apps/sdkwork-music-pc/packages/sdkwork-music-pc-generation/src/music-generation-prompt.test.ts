import { describe, expect, it } from 'vitest';
import { buildMusicGenerationPrompt } from './music-generation-prompt';

describe('buildMusicGenerationPrompt', () => {
  it('prefixes canonical English style tokens and instrumental hint', () => {
    expect(buildMusicGenerationPrompt({
      prompt: 'dreamy night drive',
      styleKeys: ['playground.music.style.pop', 'playground.music.style.electronic'],
      instrumental: true,
    })).toBe('instrumental, no vocals. pop, electronic. dreamy night drive');
  });

  it('returns trimmed prompt when no modifiers are selected', () => {
    expect(buildMusicGenerationPrompt({
      prompt: '  summer chorus  ',
      styleKeys: [],
      instrumental: false,
    })).toBe('summer chorus');
  });
});
