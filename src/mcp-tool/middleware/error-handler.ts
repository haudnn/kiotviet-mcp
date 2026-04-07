import axios from 'axios';
import { MiddlewareFn, CallToolResult } from '../types';
import { logger } from '../../utils/logger';

export const errorHandlerMiddleware: MiddlewareFn = async (ctx, next) => {
  try {
    return await next();
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      const data = err.response?.data;

      const errorMsg = data?.responseStatus?.message
        ?? data?.message
        ?? err.message;

      const errorCode = data?.responseStatus?.errorCode ?? `HTTP_${status}`;

      logger.error(`API error [${errorCode}]: ${errorMsg}`);

      const result: CallToolResult = {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(
              {
                error: true,
                status,
                errorCode,
                message: errorMsg,
                details: data?.responseStatus?.errors ?? [],
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };

      return result;
    }

    logger.error('Unexpected error:', err.message);
    return {
      content: [{ type: 'text' as const, text: JSON.stringify({ error: true, message: err.message }, null, 2) }],
      isError: true,
    };
  }
};
