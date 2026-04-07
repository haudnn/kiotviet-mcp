export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

let currentLevel: LogLevel = LogLevel.INFO;

export function setLogLevel(level: LogLevel): void {
  currentLevel = level;
}

function log(level: LogLevel, prefix: string, message: string, ...args: any[]): void {
  if (level < currentLevel) return;
  const ts = new Date().toISOString();
  const parts = [`[${ts}] ${prefix} ${message}`];
  if (args.length > 0) parts.push(JSON.stringify(args));
  // Write to stderr so stdout stays clean for MCP protocol
  process.stderr.write(parts.join(' ') + '\n');
}

export const logger = {
  debug: (message: string, ...args: any[]) => log(LogLevel.DEBUG, '[DEBUG]', message, ...args),
  info:  (message: string, ...args: any[]) => log(LogLevel.INFO,  '[INFO] ', message, ...args),
  warn:  (message: string, ...args: any[]) => log(LogLevel.WARN,  '[WARN] ', message, ...args),
  error: (message: string, ...args: any[]) => log(LogLevel.ERROR, '[ERROR]', message, ...args),
};
