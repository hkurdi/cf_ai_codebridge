import type { TranslationRequest, MessageRequest, ApiResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL;

export class ApiError extends Error {
  status?: number;
  data?: unknown;

  constructor(message: string, status?: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export const api = {
  async translate(sessionId: string, request: TranslationRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new ApiError('Translation failed', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred');
    }
  },

  async sendMessage(sessionId: string, request: MessageRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/session/${sessionId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new ApiError('Message failed', response.status);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError('Network error occurred');
    }
  },
};

export const audioUtils = {
  base64ToBlob(base64: string, mimeType: string = 'audio/mpeg'): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  },

  createAudioUrl(base64: string): string {
    const blob = this.base64ToBlob(base64);
    return URL.createObjectURL(blob);
  },
};