/**
 * UIH Runtime React - Event Mapping
 *
 * React-specific event handler mapping and normalization.
 *
 * @module @uih-dsl/runtime-react/event-mapping
 * @version 1.0.0
 */

import { EventMapper } from "@uih-dsl/runtime-core";
import type { SyntheticEvent } from "react";

// ========================================================================
// React Event Types
// ========================================================================

export type ReactEventHandler<T = Element> = (event: SyntheticEvent<T>) => void;

// ========================================================================
// React Event Mapper
// ========================================================================

/**
 * React-specific event name mapper
 */
export class ReactEventMapper extends EventMapper {
  constructor() {
    super("react");
  }

  /**
   * Convert DSL event to React event name (Spec 2.2.3)
   *
   * Examples:
   * - onclick → onClick
   * - onload → useEffect hook
   * - onsubmit → onSubmit
   */
  toReactEventName(dslEvent: string): string {
    return this.normalize(dslEvent);
  }

  /**
   * Check if event requires special handling (e.g., onload → useEffect)
   */
  requiresLifecycleHook(dslEvent: string): boolean {
    // onload requires useEffect hook
    return dslEvent === "onload";
  }
}

// ========================================================================
// React Event Utilities
// ========================================================================

/**
 * Wrap event handler with error boundary (Spec 8.2)
 */
export function wrapEventHandler<T = Element>(
  handler: ReactEventHandler<T>,
  handlerName: string
): ReactEventHandler<T> {
  return (event: SyntheticEvent<T>) => {
    try {
      handler(event);
    } catch (error) {
      console.error(`[UIH] Error in event handler "${handlerName}":`, error);
      throw error;
    }
  };
}

/**
 * Create lifecycle hook wrapper for onload events (Spec 2.3)
 *
 * Note: This returns a callback that should be used inside useEffect
 */
export function createLifecycleHook(handler: () => void): () => void {
  return () => {
    try {
      handler();
    } catch (error) {
      console.error("[UIH] Error in lifecycle hook:", error);
      throw error;
    }
  };
}
