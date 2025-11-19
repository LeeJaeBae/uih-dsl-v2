/**
 * UIH DSL Codegen Types - Svelte
 *
 * Defines output structure for Svelte 5 code generation.
 *
 * @module @uih-dsl/codegen-svelte/types
 * @version 1.0.0
 */

// ========================================================================
// Codegen Output Structure
// ========================================================================

/**
 * Complete code generation output for Svelte 5 component.
 */
export interface CodegenOutput {
  /**
   * Full generated code (.svelte file)
   */
  code: string;

  /**
   * Extracted CSS variables or style tokens (optional)
   */
  style: string | null;

  /**
   * Metadata (exported as component props)
   */
  meta: string | null;

  /**
   * Event handler function names
   */
  events: string[];
}

// ========================================================================
// Codegen Options
// ========================================================================

/**
 * Options for code generation.
 */
export interface CodegenOptions {
  /**
   * Component name (default: "Page")
   */
  componentName?: string;

  /**
   * Include comments in output (default: true)
   */
  includeComments?: boolean;

  /**
   * Indent size in spaces (default: 2)
   */
  indentSize?: number;
}
