/**
 * UIH Runtime Svelte
 *
 * Svelte-specific runtime for UIH DSL.
 * Following Runtime Specification v1.0.
 *
 * @module @uih-dsl/runtime-svelte
 * @version 1.0.0
 */

// Re-export core runtime
export * from "@uih-dsl/runtime-core";

// ========================================================================
// Svelte Error Handling
// ========================================================================

export {
  createSvelteErrorHandler,
  wrapSvelteEventHandler as wrapSvelteErrorHandler,
  formatSvelteError,
  isHydrationFailure,
} from "./error.js";

// ========================================================================
// Svelte Component Registry
// ========================================================================

export {
  SVELTE_BUILTIN_COMPONENTS,
  SvelteComponentRegistry,
  getSvelteComponentRegistry,
  resetSvelteComponentRegistry,
} from "./component-registry.js";

// ========================================================================
// Svelte Event Mapping
// ========================================================================

export {
  SvelteEventMapper,
  wrapSvelteEventHandler,
  createLifecycleHook,
} from "./event-mapping.js";

export type {
  SvelteEventHandler,
} from "./event-mapping.js";

// ========================================================================
// Svelte Style Runtime
// ========================================================================

export {
  createStyleStore,
  injectStyleTokens,
  getStyleRuntime,
  applyTheme,
  getCSSVariable,
  setCSSVariable,
  uihStyle,
} from "./style-runtime.js";

// ========================================================================
// Svelte Hydration
// ========================================================================

export {
  SvelteHydrationManager,
  isSvelteSSR,
  runClientOnly,
  createHydrationState,
  detectHydrationMismatches,
} from "./hydration.js";

// ========================================================================
// Version
// ========================================================================

export const VERSION = "1.0.0";
