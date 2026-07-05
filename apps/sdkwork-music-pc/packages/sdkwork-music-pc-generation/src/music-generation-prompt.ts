export const MUSIC_STYLE_TAG_KEYS = [
  'playground.music.style.pop',
  'playground.music.style.rock',
  'playground.music.style.electronic',
  'playground.music.style.jazz',
  'playground.music.style.hipHop',
  'playground.music.style.classical',
  'playground.music.style.ambient',
  'playground.music.style.cinematic',
] as const;

export type MusicStyleTagKey = typeof MUSIC_STYLE_TAG_KEYS[number];

const MUSIC_STYLE_API_TOKENS: Record<MusicStyleTagKey, string> = {
  'playground.music.style.pop': 'pop',
  'playground.music.style.rock': 'rock',
  'playground.music.style.electronic': 'electronic',
  'playground.music.style.jazz': 'jazz',
  'playground.music.style.hipHop': 'hip-hop',
  'playground.music.style.classical': 'classical',
  'playground.music.style.ambient': 'ambient',
  'playground.music.style.cinematic': 'cinematic',
};

export function buildMusicGenerationPrompt(input: {
  prompt: string;
  styleKeys: readonly MusicStyleTagKey[];
  instrumental: boolean;
}): string {
  const normalizedPrompt = input.prompt.trim();
  const stylePrefix = input.styleKeys.length > 0
    ? `${input.styleKeys.map((key) => MUSIC_STYLE_API_TOKENS[key]).join(', ')}. `
    : '';
  const instrumentalPrefix = input.instrumental ? 'instrumental, no vocals. ' : '';
  return `${instrumentalPrefix}${stylePrefix}${normalizedPrompt}`.trim();
}
