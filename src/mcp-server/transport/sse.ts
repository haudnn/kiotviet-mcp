import express from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { logger } from '../../utils/logger';

/**
 * Starts an HTTP server with SSE transport for multi-session support.
 * Each client connection gets its own McpServer instance.
 */
export async function startHttpTransport(
  createServer: () => McpServer,
  port: number
): Promise<void> {
  const app = express();
  app.use(express.json());

  const sessions = new Map<string, SSEServerTransport>();

  app.get('/sse', async (req, res) => {
    logger.info('New SSE connection');
    const transport = new SSEServerTransport('/messages', res);
    sessions.set(transport.sessionId, transport);

    res.on('close', () => {
      sessions.delete(transport.sessionId);
      logger.info(`SSE session ${transport.sessionId} closed`);
    });

    const server = createServer();
    await server.connect(transport);
  });

  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = sessions.get(sessionId);

    if (!transport) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }

    await transport.handlePostMessage(req, res);
  });

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', sessions: sessions.size });
  });

  await new Promise<void>((resolve) => {
    app.listen(port, () => {
      logger.info(`KiotViet MCP Server running on http://localhost:${port}`);
      logger.info(`SSE endpoint: http://localhost:${port}/sse`);
      resolve();
    });
  });
}
