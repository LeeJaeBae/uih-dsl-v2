/**
 * UIH Runtime React
 *
 * React-specific runtime for UIH DSL.
 * Following Runtime Specification v1.0.
 *
 * @module @uih-dsl/runtime-react
 * @version 1.0.0
 */

// Re-export core runtime
export * from "@uih-dsl/runtime-core";

// ========================================================================
// React Error Handling
// ========================================================================

export {
  UIHErrorBoundary,
  isMissingComponentError,
  formatRuntimeError,
} from "./error.js";

export type {
  UIHErrorBoundaryProps,
  UIHErrorBoundaryState,
} from "./error.js";

// ========================================================================
// React Component Registry
// ========================================================================

export {
  REACT_BUILTIN_COMPONENTS,
  ReactComponentRegistry,
  getReactComponentRegistry,
  resetReactComponentRegistry,
} from "./component-registry.js";

// ========================================================================
// React Event Mapping
// ========================================================================

export {
  ReactEventMapper,
  wrapEventHandler,
  createLifecycleHook,
} from "./event-mapping.js";

export type {
  ReactEventHandler,
} from "./event-mapping.js";

// ========================================================================
// React Style Runtime
// ========================================================================

export {
  StyleInjector,
  useStyleTokens,
  useStyleRuntime,
  useTheme,
  useCSSVariable,
  useSetCSSVariable,
} from "./style-runtime.js";

export type {
  StyleInjectorProps,
} from "./style-runtime.js";

// ========================================================================
// React Hydration
// ========================================================================

export {
  ReactHydrationManager,
  useHydration,
  useClientOnly,
  useHydrationMismatchDetection,
  suppressHydrationWarning,
} from "./hydration.js";

// ========================================================================
// Version
// ========================================================================

export const VERSION = "1.0.0";
