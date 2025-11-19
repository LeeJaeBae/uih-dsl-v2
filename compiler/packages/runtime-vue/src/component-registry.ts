/**
 * UIH Runtime Vue - Component Registry
 *
 * Vue-specific component registration and built-in components.
 *
 * @module @uih-dsl/runtime-vue/component-registry
 * @version 1.0.0
 */

import type { Component } from "vue";
import { ComponentRegistry as CoreRegistry } from "@uih-dsl/runtime-core";

// ========================================================================
// Vue Built-in Components (Spec 4.1)
// ========================================================================

/**
 * Vue built-in component mapping
 *
 * Maps UIH component names to Vue template tags (lowercase)
 */
export const VUE_BUILTIN_COMPONENTS = {
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
// Vue Component Registry
// ========================================================================

/**
 * Vue-specific component registry extending core registry
 */
export class VueComponentRegistry extends CoreRegistry {
  constructor() {
    super({ strict: true });
    this.initializeVueBuiltins();
  }

  /**
   * Initialize Vue built-in components
   */
  private initializeVueBuiltins(): void {
    // Override core built-ins with Vue-specific mappings (lowercase)
    for (const [uihName, htmlTag] of Object.entries(VUE_BUILTIN_COMPONENTS)) {
      this.register(uihName, htmlTag);
    }
  }

  /**
   * Register a Vue component
   */
  registerVueComponent(name: string, component: Component): void {
    this.register(name, component);
  }

  /**
   * Get Vue component by name
   */
  getVueComponent(name: string): Component | string | undefined {
    return this.get(name);
  }
}

// ========================================================================
// Singleton
// ========================================================================

let vueRegistry: VueComponentRegistry | null = null;

export function getVueComponentRegistry(): VueComponentRegistry {
  if (!vueRegistry) {
    vueRegistry = new VueComponentRegistry();
  }
  return vueRegistry;
}

export function resetVueComponentRegistry(): void {
  vueRegistry = null;
}
