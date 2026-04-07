import { MiddlewareFn } from '../types';
import { logger } from '../../utils/logger';

export const rateLimiterMiddleware: MiddlewareFn = async (ctx, next) => {
  const result = await next();

  const used = ctx.meta.rateLimitUsed;
  const max = ctx.meta.rateLimitMax;
  const retryAfter = ctx.meta.retryAfter;

  if (used !== undefined && max !== undefined) {
    const ratio = Number(used) / Number(max);
    if (ratio >= 0.8) {
      logger.warn(`Rate limit at ${used}/${max} (${Math.round(ratio * 100)}%)`);
    }
  }

  if (retryAfter) {
    logger.warn(`Rate limited — retry after ${retryAfter}s`);
  }

  return result;
};
