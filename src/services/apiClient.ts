import { APP_CONFIG } from '../constants/config';

export class ApiClient {
  private baseUrl: string = APP_CONFIG.apiBaseUrl;

  async get<T>(_endpoint: string): Promise<T> {
    // Mock API simulation with robust fallback data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({} as T);
      }, 300);
    });
  }

  async post<T>(_endpoint: string, data: any): Promise<T> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data as T);
      }, 300);
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
