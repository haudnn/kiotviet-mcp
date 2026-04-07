import axios from 'axios';
import { logger } from '../utils/logger';

export interface TokenManagerOptions {
  clientId: string;
  clientSecret: string;
  tokenUrl: string;
  /** Refresh token this many seconds before expiry (default: 300 = 5 minutes) */
  refreshBufferSeconds?: number;
}

interface TokenData {
  accessToken: string;
  expiresAt: number; // Unix timestamp ms
}

/**
 * Manages KiotViet access tokens via OAuth 2.0 Client Credentials flow.
 * Automatically refreshes the token before it expires.
 */
export class TokenManager {
  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly tokenUrl: string;
  private readonly refreshBufferMs: number;
  private tokenData: TokenData | null = null;
  private refreshPromise: Promise<string> | null = null;

  constructor(options: TokenManagerOptions) {
    this.clientId = options.clientId;
    this.clientSecret = options.clientSecret;
    this.tokenUrl = options.tokenUrl;
    this.refreshBufferMs = (options.refreshBufferSeconds ?? 300) * 1000;
  }

  /**
   * Returns a valid access token, fetching or refreshing as needed.
   * Concurrent callers share the same in-flight request (no thundering herd).
   */
  async getAccessToken(): Promise<string> {
    if (this.tokenData && !this.isExpiringSoon(this.tokenData)) {
      return this.tokenData.accessToken;
    }

    // Deduplicate concurrent refresh calls
    if (!this.refreshPromise) {
      this.refreshPromise = this.fetchToken().finally(() => {
        this.refreshPromise = null;
      });
    }

    return this.refreshPromise;
  }

  private isExpiringSoon(token: TokenData): boolean {
    return Date.now() >= token.expiresAt - this.refreshBufferMs;
  }

  private async fetchToken(): Promise<string> {
    logger.debug('Fetching new KiotViet access token...');

    const params = new URLSearchParams({
      scopes: 'PublicApi.Access',
      grant_type: 'client_credentials',
      client_id: this.clientId,
      client_secret: this.clientSecret,
    });

    const response = await axios.post(this.tokenUrl, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 15000,
    });

    const { access_token, expires_in } = response.data as {
      access_token: string;
      expires_in: number;
      token_type: string;
    };

    this.tokenData = {
      accessToken: access_token,
      expiresAt: Date.now() + expires_in * 1000,
    };

    logger.info(`Access token obtained, expires in ${expires_in}s`);
    return this.tokenData.accessToken;
  }
}
