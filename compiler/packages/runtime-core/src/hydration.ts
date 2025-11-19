/**
 * UIH Runtime Core - Hydration
 *
 * SSR hydration utilities following Runtime Specification v1.0 Section 7
 *
 * @module @uih-dsl/runtime-core/hydration
 * @version 1.0.0
 */

// ========================================================================
// Hydration Types
// ========================================================================

export type HydrationStrategy = "root" | "nested" | "client-only";

export interface HydrationOptions {
  /**
   * Hydration strategy (Spec 5.4)
   */
  strategy?: HydrationStrategy;

  /**
   * Enable hydration mismatch detection
   */
  detectMismatch?: boolean;

  /**
   * Error handler for hydration errors
   */
  onError?: (error: Error) => void;
}

// ========================================================================
// Hydration Manager
// ========================================================================

/**
 * Hydration manager for SSR → CSR transition (Spec 7.1)
 */
export class HydrationManager {
  private options: HydrationOptions;
  private hydrated: boolean;
  private hydrating: boolean;

  constructor(options: HydrationOptions = {}) {
    this.options = {
      strategy: "root",
      detectMismatch: false,
      ...options,
    };
    this.hydrated = false;
    this.hydrating = false;
  }

  /**
   * Check if currently in SSR context
   */
  isSSR(): boolean {
    return !isBrowser();
  }

  /**
   * Check if currently hydrating
   */
  isHydrating(): boolean {
    return this.hydrating;
  }

  /**
   * Check if hydration is complete
   */
  isHydrationComplete(): boolean {
    return this.hydrated;
  }

  /**
   * Mark hydration as starting
   */
  startHydration(): void {
    if (this.isSSR()) {
      console.warn("[UIH] Cannot start hydration on server");
      return;
    }

    this.hydrating = true;
    this.hydrated = false;
  }

  /**
   * Mark hydration as complete
   */
  markHydrated(): void {
    this.hydrating = false;
    this.hydrated = true;
    console.log("[UIH] Hydration complete");
  }

  /**
   * Detect hydration mismatch (Spec 8.4)
   */
  detectMismatch(serverHTML: string, clientHTML: string): boolean {
    if (!this.options.detectMismatch) {
      return false;
    }

    // Normalize whitespace for comparison
    const normalizeHTML = (html: string) =>
      html.replace(/\s+/g, " ").trim();

    const serverNormalized = normalizeHTML(serverHTML);
    const clientNormalized = normalizeHTML(clientHTML);

    return serverNormalized !== clientNormalized;
  }

  /**
   * Handle hydration error
   */
  handleError(error: Error): void {
    console.error("[UIH] Hydration error:", error);

    if (this.options.onError) {
      this.options.onError(error);
    }

    // Reset state
    this.hydrating = false;
    this.hydrated = false;
  }
}

// ========================================================================
// Hydration Utilities
// ========================================================================

/**
 * Check if running in browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

/**
 * Check if running in server environment
 */
export function isServer(): boolean {
  return !isBrowser();
}

/**
 * Wait for hydration to complete
 */
export async function waitForHydration(): Promise<void> {
  if (isServer()) {
    return Promise.resolve();
  }

  // Wait for DOM to be ready
  if (document.readyState === "loading") {
    await new Promise<void>((resolve) => {
      document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
    });
  }

  // Additional wait for framework hydration (if needed)
  await new Promise((resolve) => setTimeout(resolve, 0));
}

/**
 * Get hydration root element
 */
export function getHydrationRoot(): HTMLElement | null {
  if (isServer()) {
    return null;
  }

  // Common root element IDs/selectors
  const selectors = ["#root", "#app", "#__next", "[data-reactroot]"];

  for (const selector of selectors) {
    const element = document.querySelector<HTMLElement>(selector);
    if (element) {
      return element;
    }
  }

  // Fallback to document body
  return document.body;
}
