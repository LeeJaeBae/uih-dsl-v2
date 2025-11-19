/**
 * UIH DSL CLI - AST Command
 *
 * Displays Abstract Syntax Tree of UIH file
 */

import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import * as logger from "../utils/logger.js";

export function astCommand(filePath: string): void {
  try {
    const source = loadFile(filePath);
    const result = runPipeline(source);

    if (result.errors.length > 0) {
      logger.error("Parser errors:");
      result.errors.forEach((err) => {
        const location = err.line && err.column
          ? ` at line ${err.line}, column ${err.column}`
          : "";
        console.error(`  ${err.message}${location}`);
      });
      process.exit(1);
    }

    if (result.ast) {
      console.log(JSON.stringify(result.ast, null, 2));
      logger.success("AST generated successfully");
    } else {
      logger.error("Failed to generate AST");
      process.exit(1);
    }
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    process.exit(1);
  }
}
