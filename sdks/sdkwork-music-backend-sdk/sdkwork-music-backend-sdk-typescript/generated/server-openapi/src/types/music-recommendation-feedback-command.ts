export interface MusicRecommendationFeedbackCommand {
  itemType: 'track' | 'album' | 'artist' | 'playlist' | 'chart' | 'ai_generation_task';
  itemId: string;
  feedbackType: 'like' | 'dislike' | 'not_interested' | 'skip' | 'hide' | 'report';
  reasonCode?: string;
  context?: Record<string, unknown>;
}
