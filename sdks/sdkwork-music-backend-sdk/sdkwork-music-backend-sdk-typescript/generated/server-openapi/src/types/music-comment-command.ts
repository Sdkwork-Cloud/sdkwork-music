export interface MusicCommentCommand {
  resourceType: string;
  resourceId: string;
  parentCommentId?: string;
  body: string;
}
