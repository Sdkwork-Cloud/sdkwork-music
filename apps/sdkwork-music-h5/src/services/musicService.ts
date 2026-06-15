import { MusicHomeShelf } from '../types/music';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:18080';
const APP_API_PREFIX = import.meta.env.VITE_APP_API_PREFIX || '/app/v3/api';

class MusicService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}${APP_API_PREFIX}/music`;
  }

  async getHomeShelves(cursor?: string, limit?: number): Promise<MusicHomeShelf[]> {
    const params = new URLSearchParams();
    if (cursor) params.append('cursor', cursor);
    if (limit) params.append('limit', limit.toString());

    const url = `${this.baseUrl}/home/shelves${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.getAccessToken()}`,
        'Access-Token': this.getAccessToken(),
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch home shelves: ${response.statusText}`);
    }

    return response.json();
  }

  private getAccessToken(): string {
    // TODO: Get access token from auth context
    return '';
  }
}

export const musicService = new MusicService();
