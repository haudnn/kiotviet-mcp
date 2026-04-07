import { MiddlewareFn, McpHandler, MiddlewareContext, CallToolResult } from '../types';

/**
 * Composes an array of middleware functions around a final handler.
 * Middleware executes in order: [0] wraps [1] wraps ... wraps handler.
 */
export function composeMiddleware(
  middlewares: MiddlewareFn[],
  handler: McpHandler
): McpHandler {
  return (ctx: MiddlewareContext): Promise<CallToolResult> => {
    let index = 0;

    const dispatch = (): Promise<CallToolResult> => {
      if (index < middlewares.length) {
        const middleware = middlewares[index++];
        return middleware(ctx, dispatch);
      }
      return handler(ctx);
    };

    return dispatch();
  };
}
