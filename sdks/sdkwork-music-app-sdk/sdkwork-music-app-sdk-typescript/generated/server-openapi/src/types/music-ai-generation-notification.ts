export interface MusicAiGenerationNotification {
  id: string;
  tenantId: string;
  userId: string;
  taskId: string;
  notificationType: string;
  title?: string;
  body?: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: string;
  readAt?: string;
}
