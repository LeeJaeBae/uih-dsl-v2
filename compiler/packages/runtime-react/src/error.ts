/**
 * UIH Runtime React - Error Handling
 *
 * React-specific error boundaries and handling.
 *
 * @module @uih-dsl/runtime-react/error
 * @version 1.0.0
 */

import { Component, createElement } from "react";
import type { ErrorInfo, ReactNode } from "react";
import type { UIHRuntimeError } from "@uih-dsl/runtime-core";
import { createMissingComponentError } from "@uih-dsl/runtime-core";

// ========================================================================
// React Error Boundary (Spec 8.3)
// ========================================================================

export interface UIHErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

export interface UIHErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary for UIH runtime errors
 */
export class UIHErrorBoundary extends Component<
  UIHErrorBoundaryProps,
  UIHErrorBoundaryState
> {
  constructor(props: UIHErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): UIHErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[UIH Error Boundary] Caught error:", error);
    console.error("[UIH Error Boundary] Error info:", errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI using createElement
      return createElement(
        "div",
        { style: { padding: "20px", border: "1px solid red", borderRadius: "4px" } },
        createElement("h2", null, "UIH Runtime Error"),
        createElement("p", null, this.state.error?.message || "Unknown error occurred"),
        createElement(
          "details",
          { style: { marginTop: "10px" } },
          createElement("summary", null, "Error Details"),
          createElement(
            "pre",
            { style: { fontSize: "12px", overflow: "auto" } },
            this.state.error?.stack
          )
        )
      );
    }

    return this.props.children;
  }
}

// ========================================================================
// Error Utilities
// ========================================================================

/**
 * Check if error is a missing component error
 */
export function isMissingComponentError(error: Error): boolean {
  return (
    error.message.includes("Element type is invalid") ||
    error.message.includes("not found in registry") ||
    error.message.includes("is not registered")
  );
}

/**
 * Format error for display
 */
export function formatRuntimeError(error: UIHRuntimeError): string {
  let formatted = `[UIH ${error.type}] ${error.message}`;

  if (error.componentName) {
    formatted += `\n  Component: ${error.componentName}`;
  }

  if (error.handlerName) {
    formatted += `\n  Handler: ${error.handlerName}`;
  }

  if (error.line !== undefined && error.column !== undefined) {
    formatted += `\n  Location: line ${error.line}, column ${error.column}`;
  }

  return formatted;
}
