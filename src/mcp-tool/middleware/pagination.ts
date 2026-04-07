import { MiddlewareFn } from '../types';

/**
 * Normalises KiotViet pagination params.
 * KiotViet uses pageSize (max 100) and currentItem (offset).
 * Clamps pageSize to 100 if the caller passes a higher value.
 */
export const paginationMiddleware: MiddlewareFn = async (ctx, next) => {
  if (ctx.tool.httpMethod === 'GET') {
    if (typeof ctx.params.pageSize === 'number') {
      ctx.params.pageSize = Math.min(ctx.params.pageSize, 100);
    }
    if (typeof ctx.params.currentItem === 'number') {
      ctx.params.currentItem = Math.max(ctx.params.currentItem, 0);
    }
  }
  return next();
};
