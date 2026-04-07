import { MiddlewareFn, CallToolResult } from '../types';
import { logger } from '../../utils/logger';

export const validationMiddleware: MiddlewareFn = async (ctx, next) => {
  const result = ctx.tool.schema.safeParse(ctx.params);

  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `${i.path.join('.')}: ${i.message}`)
      .join('; ');

    logger.warn(`Validation failed for ${ctx.tool.name}: ${issues}`);

    const errorResult: CallToolResult = {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ error: true, message: `Validation error: ${issues}` }, null, 2),
        },
      ],
      isError: true,
    };
    return errorResult;
  }

  // Use the parsed (coerced) params going forward
  ctx.params = result.data;
  return next();
};
