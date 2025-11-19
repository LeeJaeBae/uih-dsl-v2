/**
 * UIH Runtime React - Hydration
 *
 * React-specific SSR hydration utilities.
 *
 * @module @uih-dsl/runtime-react/hydration
 * @version 1.0.0
 */

import { useEffect, useState, useRef } from "react";
import type { ReactNode } from "react";
import { HydrationManager, isBrowser } from "@uih-dsl/runtime-core";
import type { HydrationOptions } from "@uih-dsl/runtime-core";

// ========================================================================
// React Hydration Manager
// ========================================================================

/**
 * React-specific hydration manager
 */
export class ReactHydrationManager extends HydrationManager {
  constructor(options?: HydrationOptions) {
    super(options);
  }

  /**
   * Hydrate React root (Spec 7.1)
   *
   * Note: This is a placeholder. Actual hydration is done by ReactDOM.hydrateRoot
   * which should be called by the application code, not the runtime.
   */
  hydrateRoot(container: HTMLElement, children: ReactNode): void {
    if (this.isSSR()) {
      console.warn("[UIH] Cannot hydrate on server");
      return;
    }

    console.log("[UIH] Hydrating React root", { container, children });

    this.startHydration();

    // Note: In real usage, the app should call ReactDOM.hydrateRoot
    // This is just a marker for tracking hydration state

    this.markHydrated();
  }

  /**
   * Check if React is in hydration mode
   */
  isHydrating(): boolean {
    return super.isHydrating();
  }
}

// ========================================================================
// React Hydration Hooks
// ========================================================================

/**
 * Hook to detect hydration state
 */
export function useHydration(): {
  isHydrating: boolean;
  isHydrated: boolean;
} {
  const [isHydrated, setIsHydrated] = useState(false);
  const [isHydrating, setIsHydrating] = useState(!isBrowser());

  useEffect(() => {
    // On mount, we're no longer hydrating
    setIsHydrating(false);
    setIsHydrated(true);
  }, []);

  return { isHydrating, isHydrated };
}

/**
 * Hook to run code only on client-side (Spec 7.2)
 */
export function useClientOnly(callback: () => void): void {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current && isBrowser()) {
      callback();
      hasRun.current = true;
    }
  }, [callback]);
}

/**
 * Hook to detect hydration mismatches (Spec 8.4)
 */
export function useHydrationMismatchDetection(enabled: boolean = true): void {
  useEffect(() => {
    if (!enabled || !isBrowser()) {
      return;
    }

    // Listen for React hydration warnings
    const originalError = console.error;

    console.error = (...args: any[]) => {
      const message = args[0];

      if (
        typeof message === "string" &&
        (message.includes("Hydration") ||
          message.includes("did not match") ||
          message.includes("hydrateRoot"))
      ) {
        console.warn("[UIH] Hydration mismatch detected:", message);
      }

      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, [enabled]);
}

// ========================================================================
// React Hydration Utilities
// ========================================================================

/**
 * Suppress hydration warnings for specific element
 *
 * Note: In React, this is done by adding suppressHydrationWarning prop
 * This is a helper function for documentation purposes
 */
export function suppressHydrationWarning(element: ReactNode): ReactNode {
  // This is handled by React's suppressHydrationWarning prop
  // Just return the element as-is
  return element;
}
