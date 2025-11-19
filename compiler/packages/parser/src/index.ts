/**
 * UIH DSL Parser Package
 *
 * Entry point for the parser module.
 * Exports AST types and parser functions.
 *
 * @module @parser
 * @version 1.0.0
 */

// Export AST types
export type {
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
  Attribute,
  ScriptNode,
  ScriptProperty,
} from "./ast.js";

// Export type guards (not types)
export { isLayoutComponent, isLayoutText } from "./ast.js";

// Export parser
export { Parser, parse } from "./parser.js";

// Export parser v2 types
export type { ParserError, ParseResult } from "./parser.js";

// Export AST visitor utilities
export { visitAST, countNodes, findComponents, findTextNodes } from "./visitAST.js";
export type { ASTVisitor } from "./visitAST.js";

// Export AST transformer utilities
export {
  transformAST,
  removeEmptyTextNodes,
  removeComponentsByTag,
  renameComponent,
  removeAttributesByKey,
} from "./transformAST.js";
export type { ASTTransformer, TransformOptions } from "./transformAST.js";
