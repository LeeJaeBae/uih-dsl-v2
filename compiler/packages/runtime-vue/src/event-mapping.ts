/**
 * UIH Runtime Vue - Event Mapping
 *
 * Vue-specific event handler mapping and normalization.
 *
 * @module @uih-dsl/runtime-vue/event-mapping
 * @version 1.0.0
 */

import { EventMapper } from "@uih-dsl/runtime-core";

// ========================================================================
// Vue Event Types
// ========================================================================

export type VueEventHandler = (event: Event) => void;

// ========================================================================
// Vue Event Mapper
// ========================================================================

/**
 * Vue-specific event name mapper
 */
export class VueEventMapper extends EventMapper {
  constructor() {
    super("vue");
  }

  /**
   * Convert DSL event to Vue event name (Spec 2.2.3)
   *
   * Examples:
   * - onclick → @click
   * - onload → onMounted
   * - onsubmit → @submit
   */
  toVueEventName(dslEvent: string): string {
    return this.normalize(dslEvent);
  }

  /**
   * Check if event requires lifecycle hook (e.g., onload → onMounted)
   */
  requiresLifecycleHook(dslEvent: string): boolean {
    return dslEvent === "onload";
  }

  /**
   * Get lifecycle hook name for DSL event
   */
  getLifecycleHookName(dslEvent: string): string | null {
    if (dslEvent === "onload") {
      return "onMounted";
    }
    return null;
  }
}

// ========================================================================
// Vue Event Utilities
// ========================================================================

/**
 * Wrap event handler with error boundary (Spec 8.2)
 */
export function wrapVueEventHandler(
  handler: VueEventHandler,
  handlerName: string
): VueEventHandler {
  return (event: Event) => {
    try {
      handler(event);
    } catch (error) {
      console.error(`[UIH Vue] Error in event handler "${handlerName}":`, error);
      throw error;
    }
  };
}

/**
 * Create composable for lifecycle events (Spec 2.3)
 */
export function createLifecycleComposable(handler: () => void): () => void {
  return () => {
    try {
      handler();
    } catch (error) {
      console.error("[UIH Vue] Error in lifecycle composable:", error);
      throw error;
    }
  };
}
