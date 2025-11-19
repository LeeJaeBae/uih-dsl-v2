/**
 * UIH Runtime Core - Error Types
 *
 * Runtime error definitions following Runtime Specification v1.0 Section 8.1
 *
 * @module @uih-dsl/runtime-core/error
 * @version 1.0.0
 */

// ========================================================================
// Error Types (Spec 8.1)
// ========================================================================

export type UIHRuntimeErrorType =
  | "MISSING_COMPONENT"
  | "EVENT_HANDLER_ERROR"
  | "HYDRATION_MISMATCH";

/**
 * Runtime error shape as defined in Spec 8.1
 */
export interface UIHRuntimeError {
  type: UIHRuntimeErrorType;
  message: string;
  componentName?: string;
  handlerName?: string;
  line?: number;
  column?: number;
}

// ========================================================================
// Error Factory Functions
// ========================================================================

/**
 * Create a missing component error
 */
export function createMissingComponentError(
  componentName: string
): UIHRuntimeError {
  return {
    type: "MISSING_COMPONENT",
    message: `Component "${componentName}" is not registered`,
    componentName,
  };
}

/**
 * Create an event handler error
 */
export function createEventHandlerError(
  handlerName: string,
  originalError: Error
): UIHRuntimeError {
  return {
    type: "EVENT_HANDLER_ERROR",
    message: `Error in event handler "${handlerName}": ${originalError.message}`,
    handlerName,
  };
}

/**
 * Create a hydration mismatch error
 */
export function createHydrationMismatchError(
  message: string
): UIHRuntimeError {
  return {
    type: "HYDRATION_MISMATCH",
    message: `Hydration mismatch: ${message}`,
  };
}

// ========================================================================
// Error Handler
// ========================================================================

/**
 * Global error handler for UIH runtime errors
 */
export class UIHErrorHandler {
  private onError?: (error: UIHRuntimeError) => void;

  constructor(onError?: (error: UIHRuntimeError) => void) {
    this.onError = onError;
  }

  /**
   * Handle a UIH runtime error
   */
  handle(error: UIHRuntimeError): void {
    // Log to console
    console.error(`[UIH Runtime Error] ${error.type}:`, error.message);

    if (error.componentName) {
      console.error(`  Component: ${error.componentName}`);
    }

    if (error.handlerName) {
      console.error(`  Handler: ${error.handlerName}`);
    }

    if (error.line !== undefined && error.column !== undefined) {
      console.error(`  Location: line ${error.line}, column ${error.column}`);
    }

    // Call custom error handler if provided
    if (this.onError) {
      this.onError(error);
    }
  }

  /**
   * Report error to external service (e.g., Sentry)
   */
  report(error: UIHRuntimeError): void {
    // Default: just log
    // In production, this would send to error tracking service
    console.warn("[UIH] Error reported:", error);
  }
}
