/**
 * UIH Runtime Core - Component Registry
 *
 * Component registration and lookup following Runtime Specification v1.0 Section 4
 *
 * @module @uih-dsl/runtime-core/component-registry
 * @version 1.0.0
 */

// ========================================================================
// Component Registry Types
// ========================================================================

export type ComponentType = any; // Framework-specific component type

export interface ComponentRegistryOptions {
  /**
   * Enable strict mode (throw on missing components)
   */
  strict?: boolean;
}

// ========================================================================
// Built-in Component Registry (Spec 4.1)
// ========================================================================

/**
 * Built-in HTML tag names supported by UIH
 *
 * Spec 4.1: Div, Span, P, H1-H6, Button, Input, etc.
 */
export const BUILTIN_COMPONENTS = [
  "Div",
  "Span",
  "P",
  "H1",
  "H2",
  "H3",
  "H4",
  "H5",
  "H6",
  "Button",
  "Input",
  "Textarea",
  "Select",
  "Option",
  "Ul",
  "Ol",
  "Li",
  "Table",
  "Tr",
  "Td",
  "Th",
  "Form",
  "Label",
  "Img",
  "A",
  "Nav",
  "Header",
  "Footer",
  "Main",
  "Section",
  "Article",
  "Hr",
  "Br",
] as const;

export type BuiltinComponentName = (typeof BUILTIN_COMPONENTS)[number];

// ========================================================================
// Component Registry Class
// ========================================================================

/**
 * Component registry for built-in and custom components
 */
export class ComponentRegistry {
  private components: Map<string, ComponentType>;
  private options: ComponentRegistryOptions;
  private builtinComponents: Set<string>;

  constructor(options: ComponentRegistryOptions = {}) {
    this.components = new Map();
    this.options = { strict: false, ...options };
    this.builtinComponents = new Set();

    // Initialize built-in components (Spec 4.1)
    this.initializeBuiltins();
  }

  /**
   * Initialize built-in HTML components
   */
  private initializeBuiltins(): void {
    for (const name of BUILTIN_COMPONENTS) {
      // Built-in components are marked in the set
      this.builtinComponents.add(name);
      // The actual component (HTML tag name) is stored in lowercase
      this.components.set(name, name.toLowerCase());
    }
  }

  /**
   * Register a custom component (Spec 4.2)
   */
  register(name: string, component: ComponentType): void {
    if (this.builtinComponents.has(name)) {
      console.warn(`[UIH] Overriding built-in component: ${name}`);
    }
    this.components.set(name, component);
  }

  /**
   * Get a component by name
   */
  get(name: string): ComponentType | undefined {
    const component = this.components.get(name);

    if (!component && this.options.strict) {
      throw new Error(`Component "${name}" not found in registry`);
    }

    return component;
  }

  /**
   * Check if a component exists
   */
  has(name: string): boolean {
    return this.components.has(name);
  }

  /**
   * Check if a component is built-in
   */
  isBuiltin(name: string): boolean {
    return this.builtinComponents.has(name);
  }

  /**
   * Get all registered component names
   */
  getComponentNames(): string[] {
    return Array.from(this.components.keys()).sort();
  }

  /**
   * Get only custom component names (exclude built-ins)
   */
  getCustomComponentNames(): string[] {
    return Array.from(this.components.keys())
      .filter((name) => !this.builtinComponents.has(name))
      .sort();
  }

  /**
   * Clear all custom components (keep built-ins)
   */
  clear(): void {
    const builtinEntries = Array.from(this.components.entries()).filter(([name]) =>
      this.builtinComponents.has(name)
    );

    this.components.clear();

    // Restore built-ins
    for (const [name, component] of builtinEntries) {
      this.components.set(name, component);
    }
  }
}

// ========================================================================
// Singleton Registry
// ========================================================================

let globalRegistry: ComponentRegistry | null = null;

/**
 * Get the global component registry instance
 */
export function getComponentRegistry(): ComponentRegistry {
  if (!globalRegistry) {
    globalRegistry = new ComponentRegistry();
  }
  return globalRegistry;
}

/**
 * Reset the global registry (useful for testing)
 */
export function resetComponentRegistry(): void {
  globalRegistry = null;
}
