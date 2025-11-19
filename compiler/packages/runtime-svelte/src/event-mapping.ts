/**
 * UIH Runtime Svelte - Event Mapping
 *
 * Svelte-specific event handler mapping and normalization.
 *
 * @module @uih-dsl/runtime-svelte/event-mapping
 * @version 1.0.0
 */

import { EventMapper } from "@uih-dsl/runtime-core";

// ========================================================================
// Svelte Event Types
// ========================================================================

export type SvelteEventHandler = (event: Event) => void;

// ========================================================================
// Svelte Event Mapper
// ========================================================================

/**
 * Svelte-specific event name mapper
 */
export class SvelteEventMapper extends EventMapper {
  constructor() {
    super("svelte");
  }

  /**
   * Convert DSL event to Svelte event name (Spec 2.2.3)
   *
   * Examples:
   * - onclick → on:click
   * - onload → onMount
   * - onsubmit → on:submit
   */
  toSvelteEventName(dslEvent: string): string {
    return this.normalize(dslEvent);
  }

  /**
   * Check if event requires lifecycle hook (e.g., onload → onMount)
   */
  requiresLifecycleHook(dslEvent: string): boolean {
    return dslEvent === "onload";
  }

  /**
   * Get lifecycle hook name for DSL event
   */
  getLifecycleHookName(dslEvent: string): string | null {
    if (dslEvent === "onload") {
      return "onMount";
    }
    return null;
  }
}

// ========================================================================
// Svelte Event Utilities
// ========================================================================

/**
 * Wrap event handler with error boundary (Spec 8.2)
 */
export function wrapSvelteEventHandler(
  handler: SvelteEventHandler,
  handlerName: string
): SvelteEventHandler {
  return (event: Event) => {
    try {
      handler(event);
    } catch (error) {
      console.error(`[UIH Svelte] Error in event handler "${handlerName}":`, error);
      throw error;
    }
  };
}

/**
 * Create lifecycle hook for Svelte (Spec 2.3)
 */
export function createLifecycleHook(handler: () => void): () => void {
  return () => {
    try {
      handler();
    } catch (error) {
      console.error("[UIH Svelte] Error in lifecycle hook:", error);
      throw error;
    }
  };
}
