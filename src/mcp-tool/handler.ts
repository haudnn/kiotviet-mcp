import axios from 'axios';
import { MiddlewareContext, CallToolResult } from './types';
import { logger } from '../utils/logger';

/**
 * Default handler: resolves path params from ctx.params,
 * routes remaining params to query string (GET/DELETE) or body (POST/PUT),
 * then calls the KiotViet API.
 */
export async function kiotVietApiHandler(ctx: MiddlewareContext): Promise<CallToolResult> {
  const { tool, params, accessToken, baseUrl, retailer } = ctx;

  let resolvedPath = tool.path;
  const queryParams: Record<string, any> = {};
  const bodyParams: Record<string, any> = {};

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    const placeholder = `{${key}}`;
    if (resolvedPath.includes(placeholder)) {
      resolvedPath = resolvedPath.replace(placeholder, String(value));
    } else if (tool.httpMethod === 'GET' || tool.httpMethod === 'DELETE') {
      queryParams[key] = value;
    } else {
      bodyParams[key] = value;
    }
  }

  logger.debug(`${tool.httpMethod} ${resolvedPath}`, { queryParams, bodyParams });

  const response = await axios.request({
    method: tool.httpMethod,
    url: `${baseUrl}${resolvedPath}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Retailer: retailer,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
    data: Object.keys(bodyParams).length > 0 ? bodyParams : undefined,
    timeout: 30000,
  });

  // Expose rate-limit info for middleware
  ctx.meta.rateLimitUsed = response.headers['x-ratelimit-requestcount'];
  ctx.meta.rateLimitMax = response.headers['x-ratelimit-limit'];
  ctx.meta.retryAfter = response.headers['retry-after'];

  return {
    content: [{ type: 'text' as const, text: JSON.stringify(response.data, null, 2) }],
  };
}
