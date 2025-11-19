/**
 * UIH Runtime Svelte - Error Handling
 *
 * Svelte-specific error handling (compile-time focus).
 *
 * @module @uih-dsl/runtime-svelte/error
 * @version 1.0.0
 */

import type { UIHRuntimeError } from "@uih-dsl/runtime-core";

// ========================================================================
// Svelte Error Handler (Spec 8.3)
// ========================================================================

/**
 * Svelte catches most errors at compile time
 *
 * Note: Svelte 5 uses compile-time error detection,
 * so runtime error handling is minimal.
 */
export function createSvelteErrorHandler(
  handlerName: string
): (error: Error) => void {
  return (error: Error) => {
    console.error(`[UIH Svelte] Error in handler "${handlerName}":`, error);
    throw error;
  };
}

/**
 * Wrap event handler with error boundary
 */
export function wrapSvelteEventHandler<T extends (...args: any[]) => any>(
  handler: T,
  handlerName: string
): T {
  return ((...args: any[]) => {
    try {
      return handler(...args);
    } catch (error) {
      console.error(`[UIH Svelte] Error in event handler "${handlerName}":`, error);
      throw error;
    }
  }) as T;
}

/**
 * Format Svelte error for display
 */
export function formatSvelteError(error: Error, componentName?: string): UIHRuntimeError | null {
  if (!(error instanceof Error)) {
    return null;
  }

  // Check if it's a hydration error
  if (isHydrationFailure(error)) {
    return {
      type: "HYDRATION_MISMATCH",
      message: `Hydration failed: ${error.message}`,
      componentName,
    };
  }

  // Generic runtime error
  return {
    type: "EVENT_HANDLER_ERROR",
    message: `Svelte error: ${error.message}`,
    componentName,
  };
}

// ========================================================================
// Svelte Error Utilities
// ========================================================================

/**
 * Check if error is hydration failure
 */
export function isHydrationFailure(error: Error): boolean {
  return (
    error.message.includes("hydration") ||
    error.message.includes("Hydration") ||
    error.message.includes("mismatch") ||
    error.message.includes("server") && error.message.includes("client")
  );
}
