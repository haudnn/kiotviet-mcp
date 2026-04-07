import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { KiotVietMcpConfig } from '../utils/config';
import { TokenManager } from '../auth/token-manager';
import { allTools, filterTools } from '../mcp-tool/registry';
import { resolveToolFilter } from '../mcp-tool/presets';
import { composeMiddleware } from '../mcp-tool/middleware/chain';
import { errorHandlerMiddleware } from '../mcp-tool/middleware/error-handler';
import { rateLimiterMiddleware } from '../mcp-tool/middleware/rate-limiter';
import { paginationMiddleware } from '../mcp-tool/middleware/pagination';
import { validationMiddleware } from '../mcp-tool/middleware/validation';
import { kiotVietApiHandler } from '../mcp-tool/handler';
import { McpTool, MiddlewareContext, MiddlewareFn } from '../mcp-tool/types';
import { logger } from '../utils/logger';

const VERSION = require('../../package.json').version as string;

export interface InitResult {
  mcpServer: McpServer;
  toolCount: number;
  /** Factory for new server instances (multi-session HTTP transport) */
  createServer: () => McpServer;
}

export function initKiotVietMcpServer(config: KiotVietMcpConfig): InitResult {
  // Single token manager shared across all requests — handles auto-refresh
  const tokenManager = new TokenManager({
    clientId: config.clientId,
    clientSecret: config.clientSecret,
    tokenUrl: config.tokenUrl,
  });

  // Resolve which tools to enable
  const toolFilter = config.tools
    ? config.tools
    : resolveToolFilter('preset.default');

  const enabledTools = filterTools(allTools, toolFilter);
  logger.info(`Registering ${enabledTools.length}/${allTools.length} tools`);

  const middlewares: MiddlewareFn[] = [
    errorHandlerMiddleware,
    validationMiddleware,
    rateLimiterMiddleware,
    paginationMiddleware,
  ];

  const buildServer = (): McpServer => {
    const server = new McpServer(
      { name: 'kiotviet-mcp', version: VERSION },
      { capabilities: { tools: {} } }
    );

    for (const tool of enabledTools) {
      registerTool(server, tool, middlewares, config, tokenManager);
    }

    return server;
  };

  const mcpServer = buildServer();

  return {
    mcpServer,
    toolCount: enabledTools.length,
    createServer: buildServer,
  };
}

function registerTool(
  server: McpServer,
  tool: McpTool,
  middlewares: MiddlewareFn[],
  config: KiotVietMcpConfig,
  tokenManager: TokenManager
): void {
  const handler = tool.customHandler ?? kiotVietApiHandler;
  const composedHandler = composeMiddleware(middlewares, handler);

  server.tool(
    tool.name,
    tool.description,
    tool.schema.shape,
    async (params: any, _extra: any) => {
      const accessToken = await tokenManager.getAccessToken();

      const ctx: MiddlewareContext = {
        tool,
        params: { ...params },
        accessToken,
        baseUrl: config.baseUrl,
        retailer: config.retailer,
        meta: {},
      };

      const result = await composedHandler(ctx);
      return { content: result.content, isError: result.isError } as any;
    }
  );

  logger.debug(`Registered tool: ${tool.name}`);
}
