/**
 * UIH Runtime Svelte - Hydration
 *
 * Svelte-specific SSR hydration utilities.
 *
 * @module @uih-dsl/runtime-svelte/hydration
 * @version 1.0.0
 */

import { onMount } from "svelte";
import { writable } from "svelte/store";
import type { ComponentType } from "svelte";
import type { Writable } from "svelte/store";
import { HydrationManager, isBrowser } from "@uih-dsl/runtime-core";
import type { HydrationOptions } from "@uih-dsl/runtime-core";

// ========================================================================
// Svelte Hydration Manager
// ========================================================================

/**
 * Svelte-specific hydration manager
 */
export class SvelteHydrationManager extends HydrationManager {
  constructor(options?: HydrationOptions) {
    super(options);
  }

  /**
   * Hydrate Svelte SSR app (Spec 7.1)
   *
   * Note: This is a placeholder. Actual hydration is done by
   * new Component({ target, props, hydrate: true })
   * which should be called by the application code, not the runtime.
   */
  hydrateApp(
    Component: ComponentType,
    options: { target: HTMLElement; props?: Record<string, any> }
  ): void {
    if (this.isSSR()) {
      console.warn("[UIH] Cannot hydrate on server");
      return;
    }

    console.log("[UIH] Hydrating Svelte app", { Component, options });

    this.startHydration();

    // Note: In real usage, the app should instantiate the component with hydrate: true
    // new Component({ ...options, hydrate: true })
    // This is just a marker for tracking hydration state

    this.markHydrated();
  }

  /**
   * Check if Svelte is in hydration mode
   */
  isHydrating(): boolean {
    return super.isHydrating();
  }
}

// ========================================================================
// Svelte Hydration Utilities
// ========================================================================

/**
 * Check if running in Svelte SSR context
 */
export function isSvelteSSR(): boolean {
  return !isBrowser();
}

/**
 * Run code only on client-side (Spec 7.2)
 */
export function runClientOnly(callback: () => void): void {
  onMount(() => {
    if (isBrowser()) {
      callback();
    }
  });
}

/**
 * Detect hydration state using Svelte stores
 */
export function createHydrationState(): {
  isHydrating: Writable<boolean>;
  isHydrated: Writable<boolean>;
} {
  const isHydrating = writable(!isBrowser());
  const isHydrated = writable(false);

  onMount(() => {
    // On mount, we're no longer hydrating
    isHydrating.set(false);
    isHydrated.set(true);
  });

  return {
    isHydrating,
    isHydrated,
  };
}

/**
 * Detect hydration mismatches (Spec 8.4)
 */
export function detectHydrationMismatches(enabled: boolean = true): void {
  if (!enabled || !isBrowser()) {
    return;
  }

  onMount(() => {
    // Listen for Svelte hydration warnings
    const originalWarn = console.warn;

    console.warn = (...args: any[]) => {
      const message = args[0];

      if (
        typeof message === "string" &&
        (message.includes("hydration") ||
          message.includes("Hydration") ||
          message.includes("mismatch"))
      ) {
        console.error("[UIH] Hydration mismatch detected:", message);
      }

      originalWarn.apply(console, args);
    };

    // Cleanup on destroy
    return () => {
      console.warn = originalWarn;
    };
  });
}
