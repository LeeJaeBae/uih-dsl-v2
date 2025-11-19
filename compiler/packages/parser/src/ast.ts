/**
 * UIH DSL AST Node Type Definitions
 *
 * Based on: docs/uih-dsl-ast-schema.md
 *
 * @module @parser/ast
 * @version 1.0.0
 */

import type { Range } from "@uih-dsl/tokenizer";

// ========================================================================
// AST Root
// ========================================================================

/**
 * Root AST node representing a complete UIH DSL program.
 */
export interface ASTRoot {
  type: "Program";
  meta: MetaNode;
  style: StyleNode;
  components: ComponentsNode | null;
  layout: LayoutNode;
  script: ScriptNode | null;
}

// ========================================================================
// Meta Node
// ========================================================================

/**
 * Meta block containing page metadata.
 */
export interface MetaNode {
  type: "Meta";
  properties: MetaProperty[];
}

/**
 * Single meta property (key-value pair).
 */
export interface MetaProperty {
  key: string; // e.g. "title", "route", "theme", "description"
  value: string | number | boolean;
  location: Range;
}

// ========================================================================
// Style Node
// ========================================================================

/**
 * Style block containing design tokens and CSS variables.
 */
export interface StyleNode {
  type: "Style";
  properties: StyleProperty[];
}

/**
 * Single style property (key-value pair).
 */
export interface StyleProperty {
  key: string; // e.g. "color.primary", "font.family"
  value: string | number;
  location: Range;
}

// ========================================================================
// Components Node
// ========================================================================

/**
 * Components block declaring reusable component names.
 */
export interface ComponentsNode {
  type: "Components";
  components: ComponentEntry[];
}

/**
 * Single component entry (name only).
 */
export interface ComponentEntry {
  name: string; // e.g. "Card", "Button"
  location: Range;
}

// ========================================================================
// Layout Node (Core Tree Structure)
// ========================================================================

/**
 * Layout block containing the UI tree structure.
 */
export interface LayoutNode {
  type: "Layout";
  children: LayoutElement[]; // Top-level nodes inside layout block
}

/**
 * Union type for layout elements.
 */
export type LayoutElement = LayoutComponent | LayoutText;

/**
 * Component node in the layout tree.
 */
export interface LayoutComponent {
  type: "Component";
  tag: string; // e.g. "Div", "Header", "Button"
  attributes: Attribute[];
  children: LayoutElement[];
  location: Range;
}

/**
 * Text node in the layout tree.
 */
export interface LayoutText {
  type: "Text";
  value: string;
  location: Range;
}

/**
 * Component attribute (key-value pair).
 */
export interface Attribute {
  key: string; // lowercase only
  value: string; // inline string only
  location: Range;
}

// ========================================================================
// Script Node
// ========================================================================

/**
 * Script block containing event handler declarations.
 */
export interface ScriptNode {
  type: "Script";
  events: ScriptProperty[];
}

/**
 * Single script event property.
 */
export interface ScriptProperty {
  key: string; // e.g. "onClick", "onLoad"
  value: string; // function name
  location: Range;
}

// ========================================================================
// Type Guards
// ========================================================================

/**
 * Type guard to check if a layout element is a component.
 */
export function isLayoutComponent(
  element: LayoutElement
): element is LayoutComponent {
  return element.type === "Component";
}

/**
 * Type guard to check if a layout element is text.
 */
export function isLayoutText(element: LayoutElement): element is LayoutText {
  return element.type === "Text";
}
