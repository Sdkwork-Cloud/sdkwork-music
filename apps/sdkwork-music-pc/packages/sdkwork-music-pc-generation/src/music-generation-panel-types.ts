import type { SdkworkGenerationSerializedAssetConfig } from './generation-asset-config';

export interface MusicGenerationModelOption {
  id: string;
  name?: string;
  displayName?: string;
  vendorCode?: string;
  vendorName?: string;
}

export interface MusicGenerationModelGroup {
  id: string;
  llms: MusicGenerationModelOption[];
  music: MusicGenerationModelOption[];
}

export interface MusicGenerationSubmitInput {
  prompt: string;
  selectedModality: 'music';
  targetType?: 'music';
  selectedModel?: string;
  generationConfig?: SdkworkGenerationSerializedAssetConfig;
}

export interface MusicGenerationPanelProps {
  placeholderKey: string;
  modelGroups: MusicGenerationModelGroup[];
  selectedModelId: string;
  onSubmitGeneration: (input: MusicGenerationSubmitInput) => Promise<void>;
  submitting: boolean;
  submitError: string | null;
}
