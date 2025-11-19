/**
 * UIH DSL CLI - Logger
 *
 * Colored console output with different log levels
 */

const COLORS = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
} as const;

export function info(msg: string): void {
  console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`);
}

export function warn(msg: string): void {
  console.warn(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`);
}

export function error(msg: string): void {
  console.error(`${COLORS.red}✖${COLORS.reset} ${msg}`);
}

export function success(msg: string): void {
  console.log(`${COLORS.green}✔${COLORS.reset} ${msg}`);
}
