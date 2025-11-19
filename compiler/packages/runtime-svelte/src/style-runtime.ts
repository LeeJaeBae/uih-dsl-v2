/**
 * UIH Runtime Svelte - Style Runtime
 *
 * Svelte-specific style injection and theming.
 *
 * @module @uih-dsl/runtime-svelte/style-runtime
 * @version 1.0.0
 */

import { writable } from "svelte/store";
import type { Writable } from "svelte/store";
import { onMount } from "svelte";
import { StyleRuntime } from "@uih-dsl/runtime-core";
import type { StyleToken, StyleTheme } from "@uih-dsl/runtime-core";

// ========================================================================
// Svelte Style Stores
// ========================================================================

// Singleton instance for style runtime
let svelteRuntimeInstance: StyleRuntime | null = null;

/**
 * Create Svelte store for style runtime
 */
export function createStyleStore(tokens: StyleToken[]): {
  subscribe: (callback: (value: StyleRuntime) => void) => () => void;
  inject: (tokens: StyleToken[]) => void;
  setVariable: (name: string, value: string | number) => void;
} {
  const runtime = getStyleRuntime();
  runtime.inject(tokens);

  const store: Writable<StyleRuntime> = writable(runtime);

  return {
    subscribe: store.subscribe,
    inject: (newTokens: StyleToken[]) => {
      runtime.inject(newTokens);
      store.set(runtime);
    },
    setVariable: (name: string, value: string | number) => {
      runtime.setVariable(name, value);
      store.set(runtime);
    },
  };
}

// ========================================================================
// Svelte Style Utilities
// ========================================================================

/**
 * Inject style tokens on component mount
 */
export function injectStyleTokens(tokens: StyleToken[]): void {
  onMount(() => {
    const runtime = getStyleRuntime();
    if (tokens.length > 0) {
      runtime.inject(tokens);
    }
  });
}

/**
 * Get style runtime instance
 */
export function getStyleRuntime(): StyleRuntime {
  if (!svelteRuntimeInstance) {
    svelteRuntimeInstance = new StyleRuntime();
  }
  return svelteRuntimeInstance;
}

/**
 * Apply theme dynamically (Spec 3.3)
 */
export function applyTheme(theme: StyleTheme): void {
  onMount(() => {
    const runtime = getStyleRuntime();
    runtime.applyTheme(theme);
  });
}

/**
 * Get CSS variable value
 */
export function getCSSVariable(name: string): string | number | undefined {
  const runtime = getStyleRuntime();
  return runtime.getVariable(name);
}

/**
 * Set CSS variable value
 */
export function setCSSVariable(name: string, value: string | number): void {
  const runtime = getStyleRuntime();
  runtime.setVariable(name, value);
}

// ========================================================================
// Svelte Style Action
// ========================================================================

/**
 * Svelte action for injecting style tokens
 *
 * Usage:
 * ```svelte
 * <div use:uihStyle={tokens}>
 * ```
 */
export function uihStyle(node: HTMLElement, tokens: StyleToken[]): {
  update?: (tokens: StyleToken[]) => void;
  destroy?: () => void;
} {
  const runtime = svelteRuntimeInstance || new StyleRuntime();

  if (!svelteRuntimeInstance) {
    svelteRuntimeInstance = runtime;
  }

  // Inject tokens on mount
  if (tokens && tokens.length > 0) {
    runtime.inject(tokens);
  }

  return {
    update(newTokens: StyleToken[]) {
      if (newTokens && newTokens.length > 0) {
        runtime.inject(newTokens);
      }
    },
    destroy() {
      // Don't clear on destroy as other components might use the same tokens
    },
  };
}
