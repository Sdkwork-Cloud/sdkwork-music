import type {
  SdkworkGenerationModelBuckets,
  SdkworkGenerationPricedModel,
  SdkworkGenerationSerializedAssetConfig,
} from './generation-asset-config';

export interface MusicGenerationModelOption extends SdkworkGenerationPricedModel {
  id: string;
  name?: string;
  displayName?: string;
  vendorCode?: string;
  vendorName?: string;
}

export interface MusicGenerationModelGroup extends SdkworkGenerationModelBuckets<MusicGenerationModelOption> {
  id: string;
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
