export interface KiotVietMcpConfig {
  /** OAuth2 Client ID */
  clientId: string;
  /** OAuth2 Client Secret */
  clientSecret: string;
  /** Retailer name (required header for all API calls) */
  retailer: string;
  /** Base URL for Retail API */
  baseUrl: string;
  /** Token endpoint URL */
  tokenUrl: string;
  /** Transport mode */
  mode: 'stdio' | 'http';
  /** HTTP port when mode=http */
  port: number;
  /** Tool filter list */
  tools?: string[];
  /** Enable debug logging */
  debug: boolean;
}

const DEFAULTS = {
  baseUrl: 'https://public.kiotapi.com',
  tokenUrl: 'https://id.kiotviet.vn/connect/token',
  mode: 'stdio' as const,
  port: 3000,
  debug: false,
};

export function mergeConfig(overrides: Partial<KiotVietMcpConfig> & Pick<KiotVietMcpConfig, 'clientId' | 'clientSecret' | 'retailer'>): KiotVietMcpConfig {
  return {
    ...DEFAULTS,
    ...overrides,
  };
}
