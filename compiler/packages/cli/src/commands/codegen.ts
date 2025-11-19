/**
 * UIH DSL CLI - Codegen Command
 *
 * Generates code for target framework
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import * as logger from "../utils/logger.js";

export function codegenCommand(filePath: string, options: { out: string }): void {
  try {
    const source = loadFile(filePath);
    const result = runPipeline(source);

    if (result.errors.length > 0) {
      logger.warn("Warnings during code generation:");
      result.errors.forEach((err) => {
        console.warn(`  ${err.message}`);
      });
    }

    if (!result.code) {
      logger.error("Failed to generate code");
      process.exit(1);
    }

    const outDir = resolve(options.out);

    if (!existsSync(outDir)) {
      mkdirSync(outDir, { recursive: true });
    }

    const componentPath = join(outDir, "component.tsx");
    writeFileSync(componentPath, result.code, "utf-8");

    logger.success(`Code generated: ${componentPath}`);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    process.exit(1);
  }
}
