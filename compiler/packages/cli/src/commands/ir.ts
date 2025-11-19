/**
 * UIH DSL CLI - IR Command
 *
 * Displays Intermediate Representation of UIH file
 */

import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import * as logger from "../utils/logger.js";

export function irCommand(filePath: string): void {
  try {
    const source = loadFile(filePath);
    const result = runPipeline(source);

    if (result.errors.length > 0) {
      logger.error("IR errors:");
      result.errors.forEach((err) => {
        console.error(`  ${err.message}`);
      });
      process.exit(1);
    }

    if (result.ir) {
      console.log(JSON.stringify(result.ir, null, 2));
      logger.success("IR generated successfully");
    } else {
      logger.error("Failed to generate IR");
      process.exit(1);
    }
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    process.exit(1);
  }
}
