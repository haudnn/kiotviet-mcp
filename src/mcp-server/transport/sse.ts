import express from 'express';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { isInitializeRequest } from '@modelcontextprotocol/sdk/types.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { logger } from '../../utils/logger';

/**
 * Starts an HTTP server supporting both:
 *  - Streamable HTTP transport (modern): POST/GET /mcp
 *  - Legacy SSE transport: GET /sse + POST /messages
 */
export async function startHttpTransport(
  createServer: () => McpServer,
  port: number
): Promise<void> {
  const app = express();
  app.use(express.json());

  // ── Modern: Streamable HTTP Transport (/mcp) ─────────────────────────────
  const streamableSessions = new Map<string, StreamableHTTPServerTransport>();

  app.post('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;

    if (sessionId && streamableSessions.has(sessionId)) {
      const transport = streamableSessions.get(sessionId)!;
      await transport.handleRequest(req, res, req.body);
      return;
    }

    if (!sessionId && isInitializeRequest(req.body)) {
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        onsessioninitialized: (id) => {
          streamableSessions.set(id, transport);
          logger.info(`Streamable HTTP session initialized: ${id}`);
        },
      });

      transport.onclose = () => {
        if (transport.sessionId) {
          streamableSessions.delete(transport.sessionId);
          logger.info(`Streamable HTTP session closed: ${transport.sessionId}`);
        }
      };

      const server = createServer();
      await server.connect(transport);
      await transport.handleRequest(req, res, req.body);
      return;
    }

    res.status(400).json({
      jsonrpc: '2.0',
      error: { code: -32000, message: 'Invalid or missing session' },
      id: null,
    });
  });

  app.get('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !streamableSessions.has(sessionId)) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    res.setHeader('X-Accel-Buffering', 'no');
    await streamableSessions.get(sessionId)!.handleRequest(req, res);
  });

  app.delete('/mcp', async (req, res) => {
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    if (!sessionId || !streamableSessions.has(sessionId)) {
      res.status(400).send('Invalid or missing session ID');
      return;
    }
    await streamableSessions.get(sessionId)!.handleRequest(req, res);
  });

  // ── Legacy: SSE Transport (/sse + /messages) ─────────────────────────────
  const sseSessions = new Map<string, SSEServerTransport>();

  app.get('/sse', async (req, res) => {
    logger.info('New SSE connection (legacy)');
    res.setHeader('X-Accel-Buffering', 'no');

    const transport = new SSEServerTransport('/messages', res);
    sseSessions.set(transport.sessionId, transport);

    const keepAlive = setInterval(() => {
      if (!res.writableEnded) res.write(': ping\n\n');
    }, 30000);

    res.on('close', () => {
      clearInterval(keepAlive);
      sseSessions.delete(transport.sessionId);
      logger.info(`SSE session ${transport.sessionId} closed`);
    });

    const server = createServer();
    try {
      await server.connect(transport);
    } catch (err) {
      logger.error(`SSE session error: ${err}`);
      clearInterval(keepAlive);
      sseSessions.delete(transport.sessionId);
      if (!res.writableEnded) res.end();
    }
  });

  app.post('/messages', async (req, res) => {
    const sessionId = req.query.sessionId as string;
    const transport = sseSessions.get(sessionId);
    if (!transport) {
      res.status(404).json({ error: 'Session not found' });
      return;
    }
    await transport.handlePostMessage(req, res);
  });

  // ── Health check ─────────────────────────────────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({
      status: 'ok',
      sessions: {
        streamable: streamableSessions.size,
        sse: sseSessions.size,
      },
    });
  });

  await new Promise<void>((resolve) => {
    app.listen(port, () => {
      logger.info(`KiotViet MCP Server running on http://localhost:${port}`);
      logger.info(`Streamable HTTP endpoint: http://localhost:${port}/mcp`);
      logger.info(`SSE endpoint (legacy): http://localhost:${port}/sse`);
      resolve();
    });
  });
}
