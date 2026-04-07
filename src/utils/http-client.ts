import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { logger } from './logger';

export interface HttpClientOptions {
  baseUrl: string;
  retailer: string;
  getAccessToken: () => Promise<string>;
}

export interface ApiResponse<T = any> {
  data: T;
  rateLimitUsed?: number;
  rateLimitMax?: number;
  retryAfter?: number;
}

export class KiotVietHttpClient {
  private readonly client: AxiosInstance;
  private readonly retailer: string;
  private readonly getAccessToken: () => Promise<string>;

  constructor(options: HttpClientOptions) {
    this.retailer = options.retailer;
    this.getAccessToken = options.getAccessToken;

    this.client = axios.create({
      baseURL: options.baseUrl,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    });
  }

  async request<T = any>(
    method: string,
    path: string,
    body?: Record<string, any>,
    query?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    const accessToken = await this.getAccessToken();

    const response: AxiosResponse = await this.client.request({
      method,
      url: path,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Retailer: this.retailer,
      },
      params: query,
      data: body,
    });

    const rateLimitUsed = response.headers['x-ratelimit-requestcount']
      ? parseInt(response.headers['x-ratelimit-requestcount'])
      : undefined;
    const rateLimitMax = response.headers['x-ratelimit-limit']
      ? parseInt(response.headers['x-ratelimit-limit'])
      : undefined;
    const retryAfter = response.headers['retry-after']
      ? parseInt(response.headers['retry-after'])
      : undefined;

    logger.debug(`${method} ${path} → ${response.status}`);

    return {
      data: response.data,
      rateLimitUsed,
      rateLimitMax,
      retryAfter,
    };
  }
}
