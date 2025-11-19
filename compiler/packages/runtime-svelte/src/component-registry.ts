/**
 * UIH Runtime Svelte - Component Registry
 *
 * Svelte-specific component registration and built-in components.
 *
 * @module @uih-dsl/runtime-svelte/component-registry
 * @version 1.0.0
 */

import type { ComponentType as SvelteComponent } from "svelte";
import { ComponentRegistry as CoreRegistry } from "@uih-dsl/runtime-core";

// ========================================================================
// Svelte Built-in Components (Spec 4.1)
// ========================================================================

/**
 * Svelte built-in component mapping
 *
 * Maps UIH component names to Svelte template tags (lowercase)
 */
export const SVELTE_BUILTIN_COMPONENTS = {
  Div: "div",
  Span: "span",
  P: "p",
  H1: "h1",
  H2: "h2",
  H3: "h3",
  H4: "h4",
  H5: "h5",
  H6: "h6",
  Button: "button",
  Input: "input",
  Textarea: "textarea",
  Select: "select",
  Option: "option",
  Ul: "ul",
  Ol: "ol",
  Li: "li",
  Table: "table",
  Tr: "tr",
  Td: "td",
  Th: "th",
  Form: "form",
  Label: "label",
  Img: "img",
  A: "a",
  Nav: "nav",
  Header: "header",
  Footer: "footer",
  Main: "main",
  Section: "section",
  Article: "article",
  Hr: "hr",
  Br: "br",
} as const;

// ========================================================================
// Svelte Component Registry
// ========================================================================

/**
 * Svelte-specific component registry extending core registry
 */
export class SvelteComponentRegistry extends CoreRegistry {
  constructor() {
    super({ strict: true });
    this.initializeSvelteBuiltins();
  }

  /**
   * Initialize Svelte built-in components
   */
  private initializeSvelteBuiltins(): void {
    // Override core built-ins with Svelte-specific mappings (lowercase)
    for (const [uihName, htmlTag] of Object.entries(SVELTE_BUILTIN_COMPONENTS)) {
      this.register(uihName, htmlTag);
    }
  }

  /**
   * Register a Svelte component
   */
  registerSvelteComponent(name: string, component: SvelteComponent): void {
    this.register(name, component);
  }

  /**
   * Get Svelte component by name
   */
  getSvelteComponent(name: string): SvelteComponent | string | undefined {
    return this.get(name);
  }
}

// ========================================================================
// Singleton
// ========================================================================

let svelteRegistry: SvelteComponentRegistry | null = null;

export function getSvelteComponentRegistry(): SvelteComponentRegistry {
  if (!svelteRegistry) {
    svelteRegistry = new SvelteComponentRegistry();
  }
  return svelteRegistry;
}

export function resetSvelteComponentRegistry(): void {
  svelteRegistry = null;
}
