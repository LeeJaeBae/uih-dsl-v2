/**
 * UIH DSL AST Visitor Utility
 *
 * Provides read-only traversal of the AST in PreOrder fashion.
 * Does not mutate the AST structure.
 *
 * @module @parser/visitAST
 * @version 1.0.0
 */

import type {
  ASTRoot,
  MetaNode,
  MetaProperty,
  StyleNode,
  StyleProperty,
  ComponentsNode,
  ComponentEntry,
  LayoutNode,
  LayoutElement,
  LayoutComponent,
  LayoutText,
  ScriptNode,
  ScriptProperty,
  Attribute,
} from "./ast.js";

// ========================================================================
// Visitor Interface
// ========================================================================

/**
 * Visitor pattern interface for AST traversal.
 * All methods are optional - only implement the ones you need.
 */
export interface ASTVisitor {
  /**
   * Visit Program (root) node
   */
  Program?(node: ASTRoot): void;

  /**
   * Visit Meta block node
   */
  MetaNode?(node: MetaNode): void;

  /**
   * Visit individual meta property
   */
  MetaProperty?(node: MetaProperty): void;

  /**
   * Visit Style block node
   */
  StyleNode?(node: StyleNode): void;

  /**
   * Visit individual style property
   */
  StyleProperty?(node: StyleProperty): void;

  /**
   * Visit Components block node
   */
  ComponentsNode?(node: ComponentsNode): void;

  /**
   * Visit individual component entry
   */
  ComponentEntry?(node: ComponentEntry): void;

  /**
   * Visit Layout block node
   */
  LayoutNode?(node: LayoutNode): void;

  /**
   * Visit layout element (union type)
   */
  LayoutElement?(node: LayoutElement): void;

  /**
   * Visit layout component node
   */
  LayoutComponent?(node: LayoutComponent): void;

  /**
   * Visit layout text node
   */
  LayoutText?(node: LayoutText): void;

  /**
   * Visit component attribute
   */
  Attribute?(node: Attribute): void;

  /**
   * Visit Script block node
   */
  ScriptNode?(node: ScriptNode): void;

  /**
   * Visit individual script property (event handler)
   */
  ScriptProperty?(node: ScriptProperty): void;
}

// ========================================================================
// Visitor Implementation
// ========================================================================

/**
 * Traverse AST in PreOrder fashion (parent before children).
 * Calls appropriate visitor methods for each node type.
 *
 * @param ast - The root AST node to traverse
 * @param visitor - Visitor object with optional handler methods
 *
 * @example
 * ```typescript
 * const visitor: ASTVisitor = {
 *   LayoutComponent(node) {
 *     console.log(`Component: ${node.tag}`);
 *   },
 *   LayoutText(node) {
 *     console.log(`Text: ${node.value}`);
 *   }
 * };
 *
 * visitAST(ast, visitor);
 * ```
 */
export function visitAST(ast: ASTRoot, visitor: ASTVisitor): void {
  // Visit Program node
  visitor.Program?.(ast);

  // Visit Meta block
  visitMetaNode(ast.meta, visitor);

  // Visit Style block
  visitStyleNode(ast.style, visitor);

  // Visit Components block (optional)
  if (ast.components) {
    visitComponentsNode(ast.components, visitor);
  }

  // Visit Layout block
  visitLayoutNode(ast.layout, visitor);

  // Visit Script block (optional)
  if (ast.script) {
    visitScriptNode(ast.script, visitor);
  }
}

/**
 * Visit Meta block and its properties
 */
function visitMetaNode(node: MetaNode, visitor: ASTVisitor): void {
  visitor.MetaNode?.(node);

  for (const property of node.properties) {
    visitor.MetaProperty?.(property);
  }
}

/**
 * Visit Style block and its properties
 */
function visitStyleNode(node: StyleNode, visitor: ASTVisitor): void {
  visitor.StyleNode?.(node);

  for (const property of node.properties) {
    visitor.StyleProperty?.(property);
  }
}

/**
 * Visit Components block and its entries
 */
function visitComponentsNode(node: ComponentsNode, visitor: ASTVisitor): void {
  visitor.ComponentsNode?.(node);

  for (const component of node.components) {
    visitor.ComponentEntry?.(component);
  }
}

/**
 * Visit Layout block and its children recursively
 */
function visitLayoutNode(node: LayoutNode, visitor: ASTVisitor): void {
  visitor.LayoutNode?.(node);

  for (const child of node.children) {
    visitLayoutElement(child, visitor);
  }
}

/**
 * Visit a layout element (component or text)
 */
function visitLayoutElement(node: LayoutElement, visitor: ASTVisitor): void {
  visitor.LayoutElement?.(node);

  if (node.type === "Component") {
    visitLayoutComponent(node, visitor);
  } else if (node.type === "Text") {
    visitLayoutText(node, visitor);
  }
}

/**
 * Visit a layout component and its attributes/children
 */
function visitLayoutComponent(node: LayoutComponent, visitor: ASTVisitor): void {
  visitor.LayoutComponent?.(node);

  // Visit attributes
  for (const attribute of node.attributes) {
    visitor.Attribute?.(attribute);
  }

  // Recursively visit children
  for (const child of node.children) {
    visitLayoutElement(child, visitor);
  }
}

/**
 * Visit a layout text node
 */
function visitLayoutText(node: LayoutText, visitor: ASTVisitor): void {
  visitor.LayoutText?.(node);
}

/**
 * Visit Script block and its event handlers
 */
function visitScriptNode(node: ScriptNode, visitor: ASTVisitor): void {
  visitor.ScriptNode?.(node);

  for (const event of node.events) {
    visitor.ScriptProperty?.(event);
  }
}

// ========================================================================
// Utility: Count nodes by type
// ========================================================================

/**
 * Count all nodes in the AST by type.
 * Useful for debugging and analysis.
 *
 * @param ast - The root AST node
 * @returns Object with node counts by type
 */
export function countNodes(ast: ASTRoot): Record<string, number> {
  const counts: Record<string, number> = {
    Program: 0,
    MetaNode: 0,
    MetaProperty: 0,
    StyleNode: 0,
    StyleProperty: 0,
    ComponentsNode: 0,
    ComponentEntry: 0,
    LayoutNode: 0,
    LayoutComponent: 0,
    LayoutText: 0,
    Attribute: 0,
    ScriptNode: 0,
    ScriptProperty: 0,
  };

  const visitor: ASTVisitor = {
    Program: () => counts.Program++,
    MetaNode: () => counts.MetaNode++,
    MetaProperty: () => counts.MetaProperty++,
    StyleNode: () => counts.StyleNode++,
    StyleProperty: () => counts.StyleProperty++,
    ComponentsNode: () => counts.ComponentsNode++,
    ComponentEntry: () => counts.ComponentEntry++,
    LayoutNode: () => counts.LayoutNode++,
    LayoutComponent: () => counts.LayoutComponent++,
    LayoutText: () => counts.LayoutText++,
    Attribute: () => counts.Attribute++,
    ScriptNode: () => counts.ScriptNode++,
    ScriptProperty: () => counts.ScriptProperty++,
  };

  visitAST(ast, visitor);

  return counts;
}

// ========================================================================
// Utility: Find nodes by predicate
// ========================================================================

/**
 * Find all layout components matching a predicate.
 *
 * @param ast - The root AST node
 * @param predicate - Test function for components
 * @returns Array of matching components
 */
export function findComponents(
  ast: ASTRoot,
  predicate: (node: LayoutComponent) => boolean
): LayoutComponent[] {
  const results: LayoutComponent[] = [];

  const visitor: ASTVisitor = {
    LayoutComponent(node) {
      if (predicate(node)) {
        results.push(node);
      }
    },
  };

  visitAST(ast, visitor);

  return results;
}

/**
 * Find all text nodes matching a predicate.
 *
 * @param ast - The root AST node
 * @param predicate - Test function for text nodes
 * @returns Array of matching text nodes
 */
export function findTextNodes(
  ast: ASTRoot,
  predicate: (node: LayoutText) => boolean
): LayoutText[] {
  const results: LayoutText[] = [];

  const visitor: ASTVisitor = {
    LayoutText(node) {
      if (predicate(node)) {
        results.push(node);
      }
    },
  };

  visitAST(ast, visitor);

  return results;
}
