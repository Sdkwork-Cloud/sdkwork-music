import { useEffect, useState } from 'react';
import { AlertCircle, Disc3, Music2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SdkworkStudioGenerationBottomBar } from '@sdkwork/generations-pc-studio/react';
import {
  createDefaultSdkworkGenerationAssetConfig,
  estimateSdkworkGenerationCredits,
  findFirstSdkworkGenerationModelForModality,
  findSdkworkGenerationModelById,
  getSdkworkGenerationDurationOptions,
  reconcileSdkworkGenerationAssetConfig,
  serializeSdkworkGenerationAssetConfig,
  type SdkworkGenerationAssetConfig,
} from '../generation-asset-config';
import type { MusicGenerationPanelProps, MusicGenerationSubmitInput } from '../music-generation-panel-types';
import {
  buildMusicGenerationPrompt,
  MUSIC_STYLE_TAG_KEYS,
  type MusicStyleTagKey,
} from '../music-generation-prompt';

export function MusicGenerationPanel({
  placeholderKey,
  modelGroups,
  selectedModelId,
  onSubmitGeneration,
  submitting,
  submitError,
}: MusicGenerationPanelProps) {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState('');
  const [instrumental, setInstrumental] = useState(false);
  const [selectedStyles, setSelectedStyles] = useState<MusicStyleTagKey[]>([]);
  const [config, setConfig] = useState<SdkworkGenerationAssetConfig>(() =>
    createDefaultSdkworkGenerationAssetConfig('music'),
  );

  const selectedModel = findSdkworkGenerationModelById(modelGroups, selectedModelId)
    ?? findFirstSdkworkGenerationModelForModality(modelGroups, 'music');
  const normalizedPrompt = prompt.trim();
  const canSubmit = normalizedPrompt.length > 0 && !submitting && Boolean(selectedModel);
  const creditEstimate = estimateSdkworkGenerationCredits({
    config,
    modality: 'music',
    model: selectedModel,
    unavailableDetail: 'playground.generationCost.settlement',
  });

  useEffect(() => {
    setConfig((current) => reconcileSdkworkGenerationAssetConfig(current, 'music'));
  }, []);

  const toggleStyle = (styleKey: MusicStyleTagKey) => {
    setSelectedStyles((current) => (
      current.includes(styleKey)
        ? current.filter((item) => item !== styleKey)
        : [...current, styleKey]
    ));
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    const submitInput: MusicGenerationSubmitInput = {
      prompt: buildMusicGenerationPrompt({
        prompt: normalizedPrompt,
        styleKeys: selectedStyles,
        instrumental,
      }),
      selectedModality: 'music',
      targetType: 'music',
      selectedModel: selectedModel?.id || undefined,
      generationConfig: serializeSdkworkGenerationAssetConfig(config, 'music'),
    };

    await onSubmitGeneration(submitInput);
    setPrompt('');
  };

  const durationOptions = getSdkworkGenerationDurationOptions('music');

  return (
    <div className="sdkwork-studio-panel flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="sdkwork-studio-hero">
        <div className="sdkwork-studio-hero-icon" aria-hidden="true">
          <Disc3 className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="sdkwork-studio-hero-title">{t('playground.music.studioTitle')}</div>
          <div className="sdkwork-studio-hero-subtitle">{t('playground.music.studioSubtitle')}</div>
        </div>
      </div>

      <div className="sdkwork-studio-scroll custom-scrollbar">
        <div className="sdkwork-studio-body">
          {submitError ? (
            <div className="sdkwork-studio-error" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <span className="leading-relaxed">{submitError}</span>
            </div>
          ) : null}

          <section className="sdkwork-studio-section">
            <div className="sdkwork-studio-section-head">
              <span className="sdkwork-studio-section-head__label">
                <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
                {t('playground.music.styleSection')}
              </span>
            </div>
            <div className="sdkwork-studio-chip-grid sdkwork-studio-chip-grid--styles">
              {MUSIC_STYLE_TAG_KEYS.map((styleKey) => {
                const active = selectedStyles.includes(styleKey);
                return (
                  <button
                    key={styleKey}
                    type="button"
                    data-active={active ? 'true' : 'false'}
                    onClick={() => toggleStyle(styleKey)}
                    className="sdkwork-studio-chip"
                  >
                    {t(styleKey)}
                  </button>
                );
              })}
            </div>
          </section>

          <div className="sdkwork-studio-toggle-row">
            <div className="min-w-0">
              <div className="sdkwork-studio-toggle-row__label">{t('playground.music.instrumental')}</div>
              <div className="sdkwork-studio-toggle-row__hint">{t('playground.music.instrumentalHint')}</div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={instrumental}
              data-active={instrumental ? 'true' : 'false'}
              onClick={() => setInstrumental((current) => !current)}
              className="sdkwork-studio-toggle"
            >
              <span className="sdkwork-studio-toggle-thumb" />
            </button>
          </div>

          <div className="sdkwork-studio-prompt">
            <div className="sdkwork-studio-prompt__header">
              <span>{t('playground.music.promptSection')}</span>
              <span className="hidden max-w-[46%] truncate text-[10px] normal-case sm:inline">
                {t('playground.music.promptHint')}
              </span>
            </div>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  void handleSubmit();
                }
              }}
              className="sdkwork-studio-prompt__textarea custom-scrollbar"
              placeholder={t(placeholderKey)}
            />
            <div className="sdkwork-studio-prompt__footer">
              <span>
                <kbd className="sdkwork-studio-prompt__kbd">Enter</kbd>
                <span className="ml-1.5">{t('playground.promptKeyboard.submit')}</span>
              </span>
              <span className="tabular-nums">{normalizedPrompt.length}</span>
            </div>
          </div>

          <section className="sdkwork-studio-section">
            <div className="sdkwork-studio-section-head">
              <span>{t('playground.music.durationSection')}</span>
              <span className="font-mono normal-case">{config.durationSeconds}s</span>
            </div>
            <div className="sdkwork-studio-chip-grid">
              {durationOptions.map((duration) => (
                <button
                  key={duration}
                  type="button"
                  data-active={config.durationSeconds === duration ? 'true' : 'false'}
                  onClick={() => setConfig({ ...config, durationSeconds: duration })}
                  className="sdkwork-studio-chip"
                >
                  <Music2 className="h-3.5 w-3.5" aria-hidden="true" />
                  {duration}s
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <SdkworkStudioGenerationBottomBar
        canSubmit={canSubmit}
        creditEstimate={creditEstimate}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </div>
  );
}
