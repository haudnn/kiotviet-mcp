import { z } from 'zod';

export interface McpTool {
  /** Tool name, e.g., "kiotviet_products_list" */
  name: string;
  /** Category/project, e.g., "products", "customers" */
  project: string;
  /** Human-readable description */
  description: string;
  /** Zod schema for input parameters */
  schema: z.ZodObject<any>;
  /** HTTP method: GET, POST, PUT, DELETE */
  httpMethod: string;
  /** API endpoint path, e.g., "/products" — path params use {key} syntax */
  path: string;
  /** Custom handler override (skips default API handler) */
  customHandler?: McpHandler;
}

export type McpHandler = (ctx: MiddlewareContext) => Promise<CallToolResult>;

export interface MiddlewareContext {
  tool: McpTool;
  params: Record<string, any>;
  /** Resolved access token (injected by server) */
  accessToken: string;
  /** KiotViet base URL */
  baseUrl: string;
  /** Retailer name header value */
  retailer: string;
  /** Shared metadata bag for middleware communication */
  meta: Record<string, any>;
}

export type MiddlewareFn = (
  ctx: MiddlewareContext,
  next: () => Promise<CallToolResult>
) => Promise<CallToolResult>;

export interface CallToolResult {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

export interface ToolPreset {
  name: string;
  description: string;
  tools: string[];
}
