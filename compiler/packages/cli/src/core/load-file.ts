/**
 * UIH DSL CLI - File Loader
 *
 * Loads and reads UIH files from filesystem
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

export function loadFile(filePath: string): string {
  const absolutePath = resolve(filePath);

  if (!existsSync(absolutePath)) {
    throw new Error(`File not found: ${absolutePath}`);
  }

  return readFileSync(absolutePath, "utf-8");
}
