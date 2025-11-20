/**
 * UIH DSL CLI - Compile Command
 *
 * Compiles UIH file to target framework code
 */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import { normalizeTarget, type TargetFramework } from "../utils/target.js";
import * as logger from "../utils/logger.js";

export function compileCommand(
  filePath: string,
  options: { out: string; target?: string }
): void {
  try {
    const target = normalizeTarget(options.target);
    const source = loadFile(filePath);
    const result = runPipeline(source, target);

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

    const indexPath = join(outDir, `index.${extensionFor(target)}`);
    writeFileSync(indexPath, result.code, "utf-8");

    logger.success(`Compiled: ${indexPath}`);
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    process.exit(1);
  }
}

function extensionFor(target: TargetFramework): string {
  switch (target) {
    case "vue":
      return "vue";
    case "svelte":
      return "svelte";
    default:
      return "tsx";
  }
}
