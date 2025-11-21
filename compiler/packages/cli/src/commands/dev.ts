/**
 * UIH DSL CLI - Dev Command (Enhanced with WebSocket)
 *
 * Development mode with file watching and WebSocket broadcasting
 */

import { watch } from "chokidar";
import { resolve } from "node:path";
import { WebSocketServer } from "ws";
import { loadFile } from "../core/load-file.js";
import { runPipeline } from "../core/run-pipeline.js";
import { normalizeTarget, type TargetFramework } from "../utils/target.js";
import * as logger from "../utils/logger.js";

export function devCommand(
  filePath: string,
  options: { target?: string; port?: number }
): void {
  const absolutePath = resolve(filePath);
  const target = normalizeTarget(options.target) as TargetFramework;
  const wsPort = options.port || 3001;

  // Create WebSocket server
  const wss = new WebSocketServer({ port: wsPort });

  wss.on("connection", (ws) => {
    logger.info("Client connected to WebSocket");

    ws.on("close", () => {
      logger.info("Client disconnected");
    });
  });

  logger.success(`WebSocket server started on ws://localhost:${wsPort}`);
  logger.info(`Watching: ${absolutePath}`);

  const compile = () => {
    try {
      const source = loadFile(absolutePath);
      const result = runPipeline(source, target);

      // Broadcast to all connected clients
      const message = JSON.stringify({
        type: result.errors.length > 0 ? "error" : "success",
        code: result.code,
        ir: result.ir,
        errors: result.errors,
        timestamp: Date.now(),
        target,
      });

      let clientCount = 0;
      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          // OPEN state
          client.send(message);
          clientCount++;
        }
      });

      if (result.errors.length > 0) {
        logger.error(`Errors (broadcasted to ${clientCount} clients):`);
        result.errors.forEach((err) => {
          const location =
            err.line && err.column
              ? ` at line ${err.line}, column ${err.column}`
              : "";
          console.error(`  ${err.message}${location}`);
        });
      } else if (result.code) {
        logger.success(`Compiled and broadcasted to ${clientCount} client(s)`);
      }
    } catch (err) {
      const error = err as Error;
      logger.error(error.message);

      // Broadcast error to clients
      const errorMessage = JSON.stringify({
        type: "fatal-error",
        message: error.message,
        timestamp: Date.now(),
      });

      wss.clients.forEach((client) => {
        if (client.readyState === 1) {
          client.send(errorMessage);
        }
      });
    }
  };

  // Initial compile
  compile();

  // Watch for changes with chokidar
  const watcher = watch(absolutePath, {
    persistent: true,
    ignoreInitial: true,
    awaitWriteFinish: {
      stabilityThreshold: 100,
      pollInterval: 50,
    },
  });

  watcher.on("change", () => {
    logger.info("File changed, recompiling...");
    compile();
  });

  watcher.on("error", (error) => {
    logger.error(`Watcher error: ${error.message}`);
  });

  logger.info("Press Ctrl+C to stop");

  // Graceful shutdown
  process.on("SIGINT", () => {
    logger.info("\nShutting down...");
    watcher.close();
    wss.close(() => {
      logger.success("WebSocket server closed");
      process.exit(0);
    });
  });
}
