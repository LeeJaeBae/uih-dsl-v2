/**
 * UIH Runtime React - Component Registry
 *
 * React-specific component registration and built-in components.
 *
 * @module @uih-dsl/runtime-react/component-registry
 * @version 1.0.0
 */

import type { ComponentType as ReactComponentType } from "react";
import { ComponentRegistry as CoreRegistry } from "@uih-dsl/runtime-core";

// ========================================================================
// React Built-in Components (Spec 4.1)
// ========================================================================

/**
 * React built-in component mapping
 *
 * Maps UIH component names to React/HTML elements
 */
export const REACT_BUILTIN_COMPONENTS = {
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
// React Component Registry
// ========================================================================

/**
 * React-specific component registry extending core registry
 */
export class ReactComponentRegistry extends CoreRegistry {
  constructor() {
    super({ strict: true });
    this.initializeReactBuiltins();
  }

  /**
   * Initialize React built-in components
   */
  private initializeReactBuiltins(): void {
    // Override core built-ins with React-specific mappings
    for (const [uihName, htmlTag] of Object.entries(REACT_BUILTIN_COMPONENTS)) {
      // Store the lowercase HTML tag for React intrinsic elements
      this.register(uihName, htmlTag);
    }
  }

  /**
   * Register a React component
   */
  registerReactComponent(name: string, component: ReactComponentType): void {
    this.register(name, component);
  }

  /**
   * Get React component by name
   */
  getReactComponent(name: string): ReactComponentType | string | undefined {
    return this.get(name);
  }
}

// ========================================================================
// Singleton
// ========================================================================

let reactRegistry: ReactComponentRegistry | null = null;

export function getReactComponentRegistry(): ReactComponentRegistry {
  if (!reactRegistry) {
    reactRegistry = new ReactComponentRegistry();
  }
  return reactRegistry;
}

export function resetReactComponentRegistry(): void {
  reactRegistry = null;
}
