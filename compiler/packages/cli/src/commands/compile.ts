/**
 * UIH DSL CLI - Compile Command
 *
 * Compiles UIH file to target framework code
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import * as logger from "../utils/logger.js";

export function compileCommand(filePath: string, options: { out: string }): void {
  try {
    const source = loadFile(filePath);
    const result = runPipeline(source);

    if (result.errors.length > 0) {
      logger.error("Compilation errors:");
      result.errors.forEach((err) => {
        console.error(`  ${err.message}`);
      });
      process.exit(1);
    }

    if (!result.code) {
      logger.error("Failed to compile");
      process.exit(1);
    }

    const outDir = resolve(options.out);

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
      logger.info(`Created directory: ${outDir}`);
    }

    const indexPath = join(outDir, "index.tsx");
    writeFileSync(indexPath, result.code, "utf-8");

    logger.success(`Compiled: ${indexPath}`);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    process.exit(1);
  }
}
