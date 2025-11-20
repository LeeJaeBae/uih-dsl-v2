/**
 * UIH DSL CLI - Dev Command
 *
 * Development mode with file watching
 */

import { watchFile } from "node:fs";
import { resolve } from "node:path";
import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import { normalizeTarget } from "../utils/target.js";
import * as logger from "../utils/logger.js";

export function devCommand(filePath: string, options: { target?: string }): void {
  const absolutePath = resolve(filePath);
  const target = normalizeTarget(options.target);

  logger.info(`Watching: ${absolutePath}`);

  const compile = () => {
    try {
      const source = loadFile(absolutePath);
      const result = runPipeline(source, target);

      if (result.errors.length > 0) {
        logger.error("Errors:");
        result.errors.forEach((err) => {
          const location = err.line && err.column
            ? ` at line ${err.line}, column ${err.column}`
            : "";
          console.error(`  ${err.message}${location}`);
        });
      } else if (result.code) {
        logger.success("Compilation successful");
        console.log(result.code);
      }
    } catch (err) {
      const error = err as Error;
      logger.error(error.message);
    }
  };

  // Initial compile
  compile();

  // Watch for changes
  watchFile(absolutePath, { interval: 1000 }, () => {
    logger.info("File changed, recompiling...");
    compile();
  });

  logger.info("Press Ctrl+C to stop watching");
}
