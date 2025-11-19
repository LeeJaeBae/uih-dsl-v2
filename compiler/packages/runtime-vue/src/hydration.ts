/**
 * UIH Runtime Vue - Hydration
 *
 * Vue-specific SSR hydration utilities.
 *
 * @module @uih-dsl/runtime-vue/hydration
 * @version 1.0.0
 */

import { onMounted, onUnmounted, ref, readonly } from "vue";
import type { App, Ref } from "vue";
import { HydrationManager, isBrowser } from "@uih-dsl/runtime-core";
import type { HydrationOptions } from "@uih-dsl/runtime-core";

// ========================================================================
// Vue Hydration Manager
// ========================================================================

/**
 * Vue-specific hydration manager
 */
export class VueHydrationManager extends HydrationManager {
  constructor(options?: HydrationOptions) {
    super(options);
  }

  /**
   * Hydrate Vue SSR app (Spec 7.1)
   *
   * Note: This is a placeholder. Actual hydration is done by app.mount()
   * which should be called by the application code, not the runtime.
   */
  hydrateApp(app: App, container: string | HTMLElement): void {
    if (this.isSSR()) {
      console.warn("[UIH] Cannot hydrate on server");
      return;
    }

    console.log("[UIH] Hydrating Vue app", { app, container });

    this.startHydration();

    // Note: In real usage, the app should call app.mount(container)
    // This is just a marker for tracking hydration state

    this.markHydrated();
  }

  /**
   * Check if Vue is in hydration mode
   */
  isHydrating(): boolean {
    return super.isHydrating();
  }
}

// ========================================================================
// Vue Hydration Composables
// ========================================================================

/**
 * Composable to detect hydration state
 */
export function useHydration(): {
  isHydrating: Readonly<Ref<boolean>>;
  isHydrated: Readonly<Ref<boolean>>;
} {
  const isHydrated = ref(false);
  const isHydrating = ref(!isBrowser());

  onMounted(() => {
    // On mount, we're no longer hydrating
    isHydrating.value = false;
    isHydrated.value = true;
  });

  return {
    isHydrating: readonly(isHydrating),
    isHydrated: readonly(isHydrated),
  };
}

/**
 * Composable to run code only on client-side (Spec 7.2)
 */
export function useClientOnly(callback: () => void): void {
  const hasRun = ref(false);

  onMounted(() => {
    if (!hasRun.value && isBrowser()) {
      callback();
      hasRun.value = true;
    }
  });
}

/**
 * Composable to detect hydration mismatches (Spec 8.4)
 */
export function useHydrationMismatchDetection(enabled: boolean = true): void {
  if (!enabled || !isBrowser()) {
    return;
  }

  let originalWarn: typeof console.warn;

  onMounted(() => {
    // Listen for Vue hydration warnings
    originalWarn = console.warn;

    console.warn = (...args: any[]) => {
      const message = args[0];

      if (
        typeof message === "string" &&
        (message.includes("Hydration") ||
          message.includes("mismatch") ||
          message.includes("hydration"))
      ) {
        console.error("[UIH] Hydration mismatch detected:", message);
      }

      originalWarn.apply(console, args);
    };
  });

  onUnmounted(() => {
    // Cleanup: restore original console.warn
    if (originalWarn) {
      console.warn = originalWarn;
    }
  });
}

// ========================================================================
// Vue Hydration Utilities
// ========================================================================

/**
 * Check if running in Vue SSR context
 */
export function isVueSSR(): boolean {
  return !isBrowser();
}
