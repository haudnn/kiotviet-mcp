#!/usr/bin/env node

import { Command } from 'commander';
import * as dotenv from 'dotenv';
import { initKiotVietMcpServer } from './mcp-server/init';
import { startStdioTransport } from './mcp-server/transport/stdio';
import { startHttpTransport } from './mcp-server/transport/sse';
import { mergeConfig } from './utils/config';
import { setLogLevel, LogLevel, logger } from './utils/logger';
import { resolveToolFilter, listPresets } from './mcp-tool/presets';
import { allTools, PRESETS } from './mcp-tool/registry';

dotenv.config();

const VERSION = require('../package.json').version as string;

const program = new Command();

program
  .name('kiotviet-mcp')
  .description('KiotViet Public API MCP Server — Connect AI assistants to KiotViet stores')
  .version(VERSION);

// ============================================
// mcp — Start MCP Server
// ============================================
program
  .command('mcp')
  .description('Start the KiotViet MCP server')
  .option('--client-id <clientId>', 'KiotViet Client ID', process.env.KIOTVIET_CLIENT_ID)
  .option('--client-secret <clientSecret>', 'KiotViet Client Secret', process.env.KIOTVIET_CLIENT_SECRET)
  .option('--retailer <retailer>', 'KiotViet Retailer name', process.env.KIOTVIET_RETAILER)
  .option('--base-url <url>', 'API base URL', process.env.KIOTVIET_BASE_URL ?? 'https://public.kiotapi.com')
  .option('--token-url <url>', 'Token endpoint URL', process.env.KIOTVIET_TOKEN_URL ?? 'https://id.kiotviet.vn/connect/token')
  .option(
    '--tools <tools>',
    'Comma-separated list of tools/presets to enable (e.g., "preset.readonly,orders")'
  )
  .option('-m, --mode <mode>', 'Transport mode: stdio | http', 'stdio')
  .option('-p, --port <port>', 'Port for HTTP mode', '3000')
  .option('--debug', 'Enable debug logging')
  .action(async (options) => {
    if (options.debug) setLogLevel(LogLevel.DEBUG);

    const clientId = options.clientId;
    const clientSecret = options.clientSecret;
    const retailer = options.retailer;

    if (!clientId) {
      logger.error('Missing --client-id (or KIOTVIET_CLIENT_ID env var)');
      process.exit(1);
    }
    if (!clientSecret) {
      logger.error('Missing --client-secret (or KIOTVIET_CLIENT_SECRET env var)');
      process.exit(1);
    }
    if (!retailer) {
      logger.error('Missing --retailer (or KIOTVIET_RETAILER env var)');
      process.exit(1);
    }

    const toolFilter = options.tools ? resolveToolFilter(options.tools) : undefined;

    const config = mergeConfig({
      clientId,
      clientSecret,
      retailer,
      baseUrl: options.baseUrl,
      tokenUrl: options.tokenUrl,
      tools: toolFilter,
      mode: options.mode === 'http' ? 'http' : 'stdio',
      port: parseInt(options.port, 10),
      debug: options.debug ?? false,
    });

    const { mcpServer, toolCount, createServer } = initKiotVietMcpServer(config);

    logger.info(`KiotViet MCP Server v${VERSION}`);
    logger.info(`Retailer: ${retailer}`);
    logger.info(`Tools enabled: ${toolCount}/${allTools.length}`);
    logger.info(`Transport: ${config.mode}`);

    if (config.mode === 'http') {
      await startHttpTransport(createServer, config.port);
    } else {
      await startStdioTransport(mcpServer);
    }
  });

// ============================================
// tools — List available tools and presets
// ============================================
program
  .command('tools')
  .description('List all available tools and presets')
  .option('--presets', 'Show only presets')
  .option('--project <project>', 'Filter by project (products, customers, orders...)')
  .action((options) => {
    if (options.presets) {
      console.log('\nAvailable Presets:');
      console.log('==================');
      for (const [name, tools] of Object.entries(PRESETS)) {
        console.log(`\n  ${name} (${tools.length} tools)`);
        for (const t of tools.slice(0, 5)) console.log(`    - ${t}`);
        if (tools.length > 5) console.log(`    ... and ${tools.length - 5} more`);
      }
      return;
    }

    let tools = allTools;
    if (options.project) {
      tools = tools.filter((t) => t.project === options.project);
    }

    console.log(`\nAvailable Tools (${tools.length} total):`);
    console.log('=========================================');

    const grouped = tools.reduce((acc, t) => {
      if (!acc[t.project]) acc[t.project] = [];
      acc[t.project].push(t);
      return acc;
    }, {} as Record<string, typeof tools>);

    for (const [project, projectTools] of Object.entries(grouped)) {
      console.log(`\n  [${project}] (${projectTools.length} tools)`);
      for (const t of projectTools) {
        const desc = t.description.length > 80 ? t.description.slice(0, 80) + '...' : t.description;
        console.log(`    ${t.name}`);
        console.log(`      ${desc}`);
      }
    }
  });

program.parse(process.argv);
