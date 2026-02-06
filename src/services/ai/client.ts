import { auth } from '@/services/firebase/config';
import type { AIUseCase, AIContext, AIResponse } from './types';

/**
 * Lovable backend base URL. All server-side features (AI, etc.) run on Lovable;
 * this client sends the Firebase ID token for auth.
 */
const LOVABLE_API_URL = import.meta.env.VITE_LOVABLE_API_URL || import.meta.env.VITE_AI_GATEWAY_URL;

class AIClient {
  private async getHeaders(): Promise<Headers> {
    const headers = new Headers({
      'Content-Type': 'application/json',
    });

    const user = auth.currentUser;
    if (!user) {
      throw new Error('Authentication required');
    }

    const idToken = await user.getIdToken();
    headers.set('Authorization', `Bearer ${idToken}`);

    return headers;
  }

  async call(useCase: AIUseCase, input: string, context?: AIContext): Promise<AIResponse> {
    if (!LOVABLE_API_URL) {
      throw new Error('VITE_LOVABLE_API_URL is not set');
    }
    const headers = await this.getHeaders();

    const response = await fetch(`${LOVABLE_API_URL}/ai`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ useCase, input, context }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new RateLimitError(data.error, data.requestId);
      }
      if (response.status === 401) {
        throw new AuthError(data.error, data.requestId);
      }
      throw new AIError(data.error, response.status, data.requestId);
    }
    
    return data;
  }
}

// Error classes
export class AIError extends Error {
  code: number;
  requestId: string;
  
  constructor(message: string, code: number, requestId: string) {
    super(message);
    this.name = 'AIError';
    this.code = code;
    this.requestId = requestId;
  }
}

export class RateLimitError extends AIError {
  constructor(message: string, requestId: string) {
    super(message, 429, requestId);
    Object.setPrototypeOf(this, RateLimitError.prototype);
    this.name = 'RateLimitError';
  }
}

export class AuthError extends AIError {
  constructor(message: string, requestId: string) {
    super(message, 401, requestId);
    Object.setPrototypeOf(this, AuthError.prototype);
    this.name = 'AuthError';
  }
}

export const aiClient = new AIClient();
