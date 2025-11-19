/**
 * UIH Runtime Vue
 *
 * Vue-specific runtime for UIH DSL.
 * Following Runtime Specification v1.0.
 *
 * @module @uih-dsl/runtime-vue
 * @version 1.0.0
 */

// Re-export core runtime
export * from "@uih-dsl/runtime-core";

// ========================================================================
// Vue Error Handling
// ========================================================================

export {
  installVueErrorHandler,
  isComponentRenderError,
  formatVueError,
  createComposableErrorHandler,
} from "./error.js";

// ========================================================================
// Vue Component Registry
// ========================================================================

export {
  VUE_BUILTIN_COMPONENTS,
  VueComponentRegistry,
  getVueComponentRegistry,
  resetVueComponentRegistry,
} from "./component-registry.js";

// ========================================================================
// Vue Event Mapping
// ========================================================================

export {
  VueEventMapper,
  wrapVueEventHandler,
  createLifecycleComposable,
} from "./event-mapping.js";

export type {
  VueEventHandler,
} from "./event-mapping.js";

// ========================================================================
// Vue Style Runtime
// ========================================================================

export {
  useStyleTokens,
  useStyleRuntime,
  useTheme,
  useCSSVariable,
  useSetCSSVariable,
  vUihStyle,
} from "./style-runtime.js";

// ========================================================================
// Vue Hydration
// ========================================================================

export {
  VueHydrationManager,
  useHydration,
  useClientOnly,
  useHydrationMismatchDetection,
  isVueSSR,
} from "./hydration.js";

// ========================================================================
// Version
// ========================================================================

export const VERSION = "1.0.0";
