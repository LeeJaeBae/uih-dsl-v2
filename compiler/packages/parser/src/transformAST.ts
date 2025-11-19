/**
 * UIH DSL AST Transformer Utility
 *
 * Provides immutable transformation of the AST in PreOrder fashion.
 * Returns a new AST with transformed nodes.
 *
 * @module @parser/transformAST
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
// Transformer Interface
// ========================================================================

/**
 * Transformer pattern interface for AST transformation.
 * All methods are optional - only implement the ones you need.
 *
 * Each method receives a node and returns:
 * - A new node (transformed)
 * - The same node (no change)
 * - null (remove this node)
 */
export interface ASTTransformer {
  /**
   * Transform Program (root) node
   * Note: Cannot return null (Program is required)
   */
  Program?(node: ASTRoot): ASTRoot;

  /**
   * Transform Meta block node
   * Note: Cannot return null (Meta is required)
   */
  MetaNode?(node: MetaNode): MetaNode;

  /**
   * Transform individual meta property
   * Return null to remove this property
   */
  MetaProperty?(node: MetaProperty): MetaProperty | null;

  /**
   * Transform Style block node
   * Note: Cannot return null (Style is required)
   */
  StyleNode?(node: StyleNode): StyleNode;

  /**
   * Transform individual style property
   * Return null to remove this property
   */
  StyleProperty?(node: StyleProperty): StyleProperty | null;

  /**
   * Transform Components block node
   * Return null to remove the entire components block
   */
  ComponentsNode?(node: ComponentsNode): ComponentsNode | null;

  /**
   * Transform individual component entry
   * Return null to remove this component
   */
  ComponentEntry?(node: ComponentEntry): ComponentEntry | null;

  /**
   * Transform Layout block node
   * Note: Cannot return null (Layout is required)
   */
  LayoutNode?(node: LayoutNode): LayoutNode;

  /**
   * Transform layout element (union type)
   * Can change type (Component ↔ Text)
   * Return null to remove this element
   */
  LayoutElement?(node: LayoutElement): LayoutElement | null;

  /**
   * Transform layout component node
   * Return null to remove this component
   */
  LayoutComponent?(node: LayoutComponent): LayoutComponent | null;

  /**
   * Transform layout text node
   * Return null to remove this text node
   */
  LayoutText?(node: LayoutText): LayoutText | null;

  /**
   * Transform component attribute
   * Return null to remove this attribute
   */
  Attribute?(node: Attribute): Attribute | null;

  /**
   * Transform Script block node
   * Return null to remove the entire script block
   */
  ScriptNode?(node: ScriptNode): ScriptNode | null;

  /**
   * Transform individual script property (event handler)
   * Return null to remove this property
   */
  ScriptProperty?(node: ScriptProperty): ScriptProperty | null;
}

// ========================================================================
// Transformer Options
// ========================================================================

export interface TransformOptions {
  /**
   * If true, also call transformers after children are transformed (PostOrder).
   * Default: false (PreOrder only)
   */
  postOrder?: boolean;
}

// ========================================================================
// Transformer Implementation
// ========================================================================

/**
 * Transform AST in immutable fashion (PreOrder by default).
 * Creates a new AST with transformed nodes.
 *
 * @param ast - The root AST node to transform
 * @param transformer - Transformer object with optional handler methods
 * @param options - Transform options (PostOrder, etc.)
 * @returns New transformed AST
 *
 * @example
 * ```typescript
 * // Remove all empty text nodes
 * const transformer: ASTTransformer = {
 *   LayoutText(node) {
 *     return node.value.trim() === "" ? null : node;
 *   }
 * };
 *
 * const newAst = transformAST(ast, transformer);
 * ```
 */
export function transformAST(
  ast: ASTRoot,
  transformer: ASTTransformer,
  options: TransformOptions = {}
): ASTRoot {
  return transformProgram(ast, transformer, options);
}

/**
 * Transform Program (root) node
 */
function transformProgram(
  node: ASTRoot,
  transformer: ASTTransformer,
  options: TransformOptions
): ASTRoot {
  // PreOrder: transform node first (if transformer is provided)
  let current = node;
  if (transformer.Program && !options.postOrder) {
    current = transformer.Program(current);
  }

  // Transform children
  const meta = transformMetaNode(current.meta, transformer, options);
  const style = transformStyleNode(current.style, transformer, options);
  const components = current.components
    ? transformComponentsNode(current.components, transformer, options)
    : null;
  const layout = transformLayoutNode(current.layout, transformer, options);
  const script = current.script
    ? transformScriptNode(current.script, transformer, options)
    : null;

  // Create new node with transformed children
  const transformed: ASTRoot = {
    ...current,
    meta,
    style,
    components,
    layout,
    script,
  };

  // PostOrder: transform after children
  if (transformer.Program && options.postOrder) {
    return transformer.Program(transformed);
  }

  return transformed;
}

/**
 * Transform Meta block and its properties
 */
function transformMetaNode(
  node: MetaNode,
  transformer: ASTTransformer,
  options: TransformOptions
): MetaNode {
  // PreOrder
  let current = node;
  if (transformer.MetaNode && !options.postOrder) {
    current = transformer.MetaNode(current);
  }

  // Transform properties
  const properties = current.properties
    .map((prop) => transformMetaProperty(prop, transformer, options))
    .filter((prop): prop is MetaProperty => prop !== null);

  // Create new node
  const transformed: MetaNode = {
    ...current,
    properties,
  };

  // PostOrder
  if (transformer.MetaNode && options.postOrder) {
    return transformer.MetaNode(transformed);
  }

  return transformed;
}

/**
 * Transform individual meta property
 */
function transformMetaProperty(
  node: MetaProperty,
  transformer: ASTTransformer,
  _options: TransformOptions
): MetaProperty | null {
  if (!transformer.MetaProperty) {
    return node;
  }

  // PreOrder only (no children)
  return transformer.MetaProperty(node);
}

/**
 * Transform Style block and its properties
 */
function transformStyleNode(
  node: StyleNode,
  transformer: ASTTransformer,
  options: TransformOptions
): StyleNode {
  // PreOrder
  let current = node;
  if (transformer.StyleNode && !options.postOrder) {
    current = transformer.StyleNode(current);
  }

  // Transform properties
  const properties = current.properties
    .map((prop) => transformStyleProperty(prop, transformer, options))
    .filter((prop): prop is StyleProperty => prop !== null);

  // Create new node
  const transformed: StyleNode = {
    ...current,
    properties,
  };

  // PostOrder
  if (transformer.StyleNode && options.postOrder) {
    return transformer.StyleNode(transformed);
  }

  return transformed;
}

/**
 * Transform individual style property
 */
function transformStyleProperty(
  node: StyleProperty,
  transformer: ASTTransformer,
  _options: TransformOptions
): StyleProperty | null {
  if (!transformer.StyleProperty) {
    return node;
  }

  return transformer.StyleProperty(node);
}

/**
 * Transform Components block and its entries
 */
function transformComponentsNode(
  node: ComponentsNode,
  transformer: ASTTransformer,
  options: TransformOptions
): ComponentsNode | null {
  // PreOrder
  let current: ComponentsNode | null = node;
  if (transformer.ComponentsNode && !options.postOrder) {
    current = transformer.ComponentsNode(current);
    if (current === null) return null;
  }

  // Transform components
  const components = current.components
    .map((comp) => transformComponentEntry(comp, transformer, options))
    .filter((comp): comp is ComponentEntry => comp !== null);

  // Create new node
  const transformed: ComponentsNode = {
    ...current,
    components,
  };

  // PostOrder
  if (transformer.ComponentsNode && options.postOrder) {
    return transformer.ComponentsNode(transformed);
  }

  return transformed;
}

/**
 * Transform individual component entry
 */
function transformComponentEntry(
  node: ComponentEntry,
  transformer: ASTTransformer,
  _options: TransformOptions
): ComponentEntry | null {
  if (!transformer.ComponentEntry) {
    return node;
  }

  return transformer.ComponentEntry(node);
}

/**
 * Transform Layout block and its children recursively
 */
function transformLayoutNode(
  node: LayoutNode,
  transformer: ASTTransformer,
  options: TransformOptions
): LayoutNode {
  // PreOrder
  let current = node;
  if (transformer.LayoutNode && !options.postOrder) {
    current = transformer.LayoutNode(current);
  }

  // Transform children
  const children = current.children
    .map((child) => transformLayoutElement(child, transformer, options))
    .filter((child): child is LayoutElement => child !== null);

  // Create new node
  const transformed: LayoutNode = {
    ...current,
    children,
  };

  // PostOrder
  if (transformer.LayoutNode && options.postOrder) {
    return transformer.LayoutNode(transformed);
  }

  return transformed;
}

/**
 * Transform a layout element (component or text)
 */
function transformLayoutElement(
  node: LayoutElement,
  transformer: ASTTransformer,
  options: TransformOptions
): LayoutElement | null {
  // PreOrder: transform generic LayoutElement first
  let current: LayoutElement | null = node;
  if (transformer.LayoutElement && !options.postOrder) {
    current = transformer.LayoutElement(current);
    if (current === null) return null;
  }

  // Transform specific type
  let transformed: LayoutElement | null;
  if (current.type === "Component") {
    transformed = transformLayoutComponent(current, transformer, options);
  } else {
    transformed = transformLayoutText(current, transformer, options);
  }

  if (transformed === null) return null;

  // PostOrder: transform generic LayoutElement after
  if (transformer.LayoutElement && options.postOrder) {
    return transformer.LayoutElement(transformed);
  }

  return transformed;
}

/**
 * Transform a layout component and its attributes/children
 */
function transformLayoutComponent(
  node: LayoutComponent,
  transformer: ASTTransformer,
  options: TransformOptions
): LayoutComponent | null {
  // PreOrder
  let current: LayoutComponent | null = node;
  if (transformer.LayoutComponent && !options.postOrder) {
    current = transformer.LayoutComponent(current);
    if (current === null) return null;
  }

  // Transform attributes
  const attributes = current.attributes
    .map((attr) => transformAttribute(attr, transformer, options))
    .filter((attr): attr is Attribute => attr !== null);

  // Transform children
  const children = current.children
    .map((child) => transformLayoutElement(child, transformer, options))
    .filter((child): child is LayoutElement => child !== null);

  // Create new node
  const transformed: LayoutComponent = {
    ...current,
    attributes,
    children,
  };

  // PostOrder
  if (transformer.LayoutComponent && options.postOrder) {
    return transformer.LayoutComponent(transformed);
  }

  return transformed;
}

/**
 * Transform a layout text node
 */
function transformLayoutText(
  node: LayoutText,
  transformer: ASTTransformer,
  _options: TransformOptions
): LayoutText | null {
  if (!transformer.LayoutText) {
    return node;
  }

  return transformer.LayoutText(node);
}

/**
 * Transform an attribute
 */
function transformAttribute(
  node: Attribute,
  transformer: ASTTransformer,
  _options: TransformOptions
): Attribute | null {
  if (!transformer.Attribute) {
    return node;
  }

  return transformer.Attribute(node);
}

/**
 * Transform Script block and its event handlers
 */
function transformScriptNode(
  node: ScriptNode,
  transformer: ASTTransformer,
  options: TransformOptions
): ScriptNode | null {
  // PreOrder
  let current: ScriptNode | null = node;
  if (transformer.ScriptNode && !options.postOrder) {
    current = transformer.ScriptNode(current);
    if (current === null) return null;
  }

  // Transform events
  const events = current.events
    .map((event) => transformScriptProperty(event, transformer, options))
    .filter((event): event is ScriptProperty => event !== null);

  // Create new node
  const transformed: ScriptNode = {
    ...current,
    events,
  };

  // PostOrder
  if (transformer.ScriptNode && options.postOrder) {
    return transformer.ScriptNode(transformed);
  }

  return transformed;
}

/**
 * Transform individual script property (event handler)
 */
function transformScriptProperty(
  node: ScriptProperty,
  transformer: ASTTransformer,
  _options: TransformOptions
): ScriptProperty | null {
  if (!transformer.ScriptProperty) {
    return node;
  }

  return transformer.ScriptProperty(node);
}

// ========================================================================
// Utility Transformers
// ========================================================================

/**
 * Remove all empty text nodes from the layout tree.
 *
 * @param ast - The root AST node
 * @returns New AST without empty text nodes
 */
export function removeEmptyTextNodes(ast: ASTRoot): ASTRoot {
  return transformAST(ast, {
    LayoutText(node) {
      return node.value.trim() === "" ? null : node;
    },
  });
}

/**
 * Remove all components with a specific tag name.
 *
 * @param ast - The root AST node
 * @param tagName - Tag name to remove
 * @returns New AST without specified components
 */
export function removeComponentsByTag(ast: ASTRoot, tagName: string): ASTRoot {
  return transformAST(ast, {
    LayoutComponent(node) {
      return node.tag === tagName ? null : node;
    },
  });
}

/**
 * Rename all components with a specific tag.
 *
 * @param ast - The root AST node
 * @param oldTag - Old tag name
 * @param newTag - New tag name
 * @returns New AST with renamed components
 */
export function renameComponent(
  ast: ASTRoot,
  oldTag: string,
  newTag: string
): ASTRoot {
  return transformAST(ast, {
    LayoutComponent(node) {
      if (node.tag === oldTag) {
        return { ...node, tag: newTag };
      }
      return node;
    },
  });
}

/**
 * Remove all attributes with a specific key.
 *
 * @param ast - The root AST node
 * @param key - Attribute key to remove
 * @returns New AST without specified attributes
 */
export function removeAttributesByKey(ast: ASTRoot, key: string): ASTRoot {
  return transformAST(ast, {
    Attribute(node) {
      return node.key === key ? null : node;
    },
  });
}
