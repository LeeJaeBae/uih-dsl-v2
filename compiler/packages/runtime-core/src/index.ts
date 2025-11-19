/**
 * UIH Runtime Core
 *
 * Framework-agnostic runtime utilities for UIH DSL.
 * Following Runtime Specification v1.0.
 *
 * @module @uih-dsl/runtime-core
 * @version 1.0.0
 */

// ========================================================================
// Error Handling (Spec 8)
// ========================================================================

export type {
  UIHRuntimeError,
  UIHRuntimeErrorType,
} from "./error.js";

export {
  createMissingComponentError,
  createEventHandlerError,
  createHydrationMismatchError,
  UIHErrorHandler,
} from "./error.js";

// ========================================================================
// Component Registry (Spec 4)
// ========================================================================

export type {
  ComponentType,
  ComponentRegistryOptions,
  BuiltinComponentName,
} from "./component-registry.js";

export {
  BUILTIN_COMPONENTS,
  ComponentRegistry,
  getComponentRegistry,
  resetComponentRegistry,
} from "./component-registry.js";

// ========================================================================
// Event Mapping (Spec 2)
// ========================================================================

export type {
  EventHandlerFunction,
  EventMapping,
  DSLEventName,
  FrameworkName,
} from "./event-mapping.js";

export {
  EVENT_NAME_MAP,
  EventMapper,
  EventHandlerRegistry,
} from "./event-mapping.js";

// ========================================================================
// Style Runtime (Spec 3)
// ========================================================================

export type {
  StyleToken,
  StyleTheme,
} from "./style-runtime.js";

export {
  pathToCSSVariable,
  tokenToCSSDeclaration,
  generateCSSRoot,
  StyleRuntime,
} from "./style-runtime.js";

// ========================================================================
// Hydration (Spec 7)
// ========================================================================

export type {
  HydrationStrategy,
  HydrationOptions,
} from "./hydration.js";

export {
  HydrationManager,
  isBrowser,
  isServer,
  waitForHydration,
  getHydrationRoot,
} from "./hydration.js";

// ========================================================================
// Version
// ========================================================================

export const VERSION = "1.0.0";
