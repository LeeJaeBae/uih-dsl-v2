/**
 * UIH Runtime Vue - Error Handling
 *
 * Vue-specific error handling and error handlers.
 *
 * @module @uih-dsl/runtime-vue/error
 * @version 1.0.0
 */

import type { UIHRuntimeError } from "@uih-dsl/runtime-core";
import type { App, ComponentPublicInstance } from "vue";

// ========================================================================
// Vue Error Handler (Spec 8.3)
// ========================================================================

/**
 * Install global error handler for Vue app
 */
export function installVueErrorHandler(app: App): void {
  app.config.errorHandler = (err, instance, info) => {
    console.error("[UIH Vue Error]", err);
    console.error("[UIH Vue Error] Component:", instance);
    console.error("[UIH Vue Error] Info:", info);

    const uihError = formatVueError(err, instance, info);
    if (uihError) {
      console.error("[UIH Vue Error] Formatted:", uihError);
    }
  };
}

/**
 * Check if error is component render error
 */
export function isComponentRenderError(info: string): boolean {
  return (
    info === "component render" ||
    info.includes("render") ||
    info.includes("Failed to resolve component")
  );
}

/**
 * Format Vue error for display
 */
export function formatVueError(
  err: unknown,
  instance: ComponentPublicInstance | null,
  info: string
): UIHRuntimeError | null {
  if (!(err instanceof Error)) {
    return null;
  }

  const message = err.message;
  const componentName = instance?.$options.name || instance?.$options.__name || "Unknown";

  if (isComponentRenderError(info)) {
    return {
      type: "MISSING_COMPONENT",
      message: `Component render error: ${message}`,
      componentName,
    };
  }

  return {
    type: "EVENT_HANDLER_ERROR",
    message: `Vue error in ${info}: ${message}`,
    componentName,
  };
}

// ========================================================================
// Vue Error Utilities
// ========================================================================

/**
 * Create error handler for Vue composables
 */
export function createComposableErrorHandler(
  handlerName: string
): (error: Error) => void {
  return (error: Error) => {
    console.error(`[UIH Vue] Error in composable "${handlerName}":`, error);
    throw error;
  };
}
