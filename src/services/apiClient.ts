import { APP_CONFIG } from '../constants/config';
import { Platform } from 'react-native';

export class ApiClient {
  private getBaseUrl(): string {
    let url = APP_CONFIG.apiBaseUrl;
    if (Platform.OS === 'android' && url.includes('localhost')) {
      url = url.replace('localhost', '10.0.2.2');
    }
    return url;
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          ...(options?.headers || {}),
        },
        ...options,
      });

      if (!response.ok) {
        const errorJson = await response.json().catch(() => ({}));
        const errMsg = errorJson.error || errorJson.message || `HTTP error ${response.status}: ${response.statusText}`;
        throw new Error(errMsg);
      }
      return await response.json();
    } catch (error: any) {
      console.warn(`[ApiClient] GET ${endpoint} failed:`, error.message);
      throw error;
    }
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<T> {
    const url = `${this.getBaseUrl()}${endpoint}`;
    try {
      const isFormData = data instanceof FormData;
      const headers: Record<string, string> = {
        Accept: 'application/json',
        ...(options?.headers as Record<string, string> || {}),
      };
      if (!isFormData) {
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers,
        body: isFormData ? data : JSON.stringify(data),
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error: any) {
      console.warn(`[ApiClient] POST ${endpoint} failed:`, error.message);
      throw error;
    }
  }
}

export const apiClient = new ApiClient();
export default apiClient;
