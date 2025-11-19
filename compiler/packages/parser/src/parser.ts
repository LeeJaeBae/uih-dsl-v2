/**
 * UIH DSL Parser v2 - Error Collection & Recovery
 *
 * Transforms token stream from Tokenizer v2.1 into AST with error collection.
 *
 * Design principles:
 * - No throw statements (collect all errors)
 * - Error recovery at NEWLINE, RBRACE, EOF
 * - Partial AST generation (best effort)
 * - Multiple error reporting
 *
 * @module @parser/parser
 * @version 2.0.0
 */

import type { Token, Range } from "@uih-dsl/tokenizer";
import { TokenType, TokenizerMode } from "@uih-dsl/tokenizer";
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
  Attribute,
  ScriptNode,
  ScriptProperty,
} from "./ast.js";

/**
 * Parser error information.
 */
export interface ParserError {
  message: string;
  line: number;
  column: number;
}

/**
 * Parse result containing AST and errors.
 */
export interface ParseResult {
  ast: ASTRoot | null;
  errors: ParserError[];
}

/**
 * Parser class for UIH DSL v2.
 *
 * Implements error collection and recovery mechanisms.
 *
 * @public
 */
export class Parser {
  private tokens: Token[];
  private current: number = 0;
  private errors: ParserError[] = [];

  /**
   * Create a new parser instance.
   *
   * @param tokens - Token stream from Tokenizer v2.1
   */
  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  // ========================================================================
  // Main Entry Point
  // ========================================================================

  /**
   * Parse the complete token stream into an AST with error collection.
   *
   * @returns ParseResult with AST and errors
   */
  public parseFile(): ParseResult {
    this.errors = [];
    this.current = 0;

    this.skipNewlines();

    const meta = this.parseBlock("meta") as MetaNode | null;
    const style = this.parseBlock("style") as StyleNode | null;
    const components = this.parseBlock("components") as ComponentsNode | null;
    const layout = this.parseBlock("layout") as LayoutNode | null;
    const script = this.parseBlock("script") as ScriptNode | null;

    if (!layout) {
      this.recordError("Layout block is required", this.peek().range.start);
    }

    const finalMeta: MetaNode = meta || {
      type: "Meta",
      properties: [],
    };

    const finalStyle: StyleNode = style || {
      type: "Style",
      properties: [],
    };

    this.skipNewlines();
    if (!this.isAtEnd()) {
      this.recordError(
        `Unexpected token after script block: ${this.peek().value}`,
        this.peek().range.start
      );
      this.skipUntilRecoveryPoint();
    }

    const ast: ASTRoot | null = layout
      ? {
          type: "Program",
          meta: finalMeta,
          style: finalStyle,
          components,
          layout,
          script,
        }
      : null;

    return {
      ast,
      errors: this.errors,
    };
  }

  // ========================================================================
  // Block Parsing
  // ========================================================================

  /**
   * Parse a top-level block with error recovery.
   *
   * @param expectedBlockName - Expected block identifier
   * @returns Parsed block node or null if failed
   */
  private parseBlock(
    expectedBlockName: string
  ): MetaNode | StyleNode | ComponentsNode | LayoutNode | ScriptNode | null {
    this.skipNewlines();

    const token = this.peek();

    if (token.type !== TokenType.IDENTIFIER || token.value !== expectedBlockName) {
      return null;
    }

    if (expectedBlockName === "layout" && !token.isPotentialLayoutStart) {
      return null;
    }

    this.consume();

    this.skipNewlines();
    if (!this.match(TokenType.LBRACE)) {
      this.recordError(`Expected LBRACE after ${expectedBlockName}`, this.peek().range.start);
      this.skipUntilRecoveryPoint();
      return null;
    }
    this.consume();
    this.skipNewlines();

    let result:
      | MetaNode
      | StyleNode
      | ComponentsNode
      | LayoutNode
      | ScriptNode
      | null = null;

    try {
      switch (expectedBlockName) {
        case "meta":
          result = this.parseMeta();
          break;
        case "style":
          result = this.parseStyle();
          break;
        case "components":
          result = this.parseComponents();
          break;
        case "layout":
          result = this.parseLayout();
          break;
        case "script":
          result = this.parseScript();
          break;
        default:
          this.recordError(`Unknown block type: ${expectedBlockName}`, token.range.start);
          this.skipUntilRecoveryPoint();
          return null;
      }
    } catch (e) {
      this.skipUntilRecoveryPoint();
      return null;
    }

    this.skipNewlines();
    if (!this.match(TokenType.RBRACE)) {
      this.recordError(`Expected RBRACE to close ${expectedBlockName} block`, this.peek().range.start);
      this.skipUntilRecoveryPoint();
    } else {
      this.consume();
    }
    this.skipNewlines();

    return result;
  }

  /**
   * Parse meta block content with error recovery.
   *
   * @returns MetaNode
   */
  private parseMeta(): MetaNode {
    const properties: MetaProperty[] = [];

    while (!this.match(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      if (this.match(TokenType.RBRACE)) {
        break;
      }

      if (!this.match(TokenType.IDENTIFIER)) {
        this.recordError("Expected property key (IDENTIFIER)", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }

      const keyToken = this.consume();

      if (!this.match(TokenType.COLON)) {
        this.recordError("Expected COLON after property key", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }
      this.consume();

      const value = this.parseLiteral();
      if (value === null) {
        this.skipUntilRecoveryPoint();
        continue;
      }

      const location: Range = {
        start: keyToken.range.start,
        end: this.tokens[this.current - 1].range.end,
      };

      properties.push({
        key: keyToken.value,
        value,
        location,
      });

      this.skipNewlines();
    }

    return {
      type: "Meta",
      properties,
    };
  }

  /**
   * Parse style block content with error recovery.
   *
   * @returns StyleNode
   */
  private parseStyle(): StyleNode {
    const properties: StyleProperty[] = [];

    while (!this.match(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      if (this.match(TokenType.RBRACE)) {
        break;
      }

      if (!this.match(TokenType.IDENTIFIER)) {
        this.recordError("Expected style key (IDENTIFIER)", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }

      const keyToken = this.consume();

      if (!this.match(TokenType.COLON)) {
        this.recordError("Expected COLON after style key", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }
      this.consume();

      const value = this.parseLiteral();
      if (value === null) {
        this.skipUntilRecoveryPoint();
        continue;
      }

      if (typeof value === "boolean") {
        this.recordError("Style values cannot be boolean", keyToken.range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }

      const location: Range = {
        start: keyToken.range.start,
        end: this.tokens[this.current - 1].range.end,
      };

      properties.push({
        key: keyToken.value,
        value,
        location,
      });

      this.skipNewlines();
    }

    return {
      type: "Style",
      properties,
    };
  }

  /**
   * Parse components block content with error recovery.
   *
   * @returns ComponentsNode
   */
  private parseComponents(): ComponentsNode {
    const components: ComponentEntry[] = [];

    while (!this.match(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      if (this.match(TokenType.RBRACE)) {
        break;
      }

      if (!this.match(TokenType.TAGNAME)) {
        this.recordError("Expected component name (TAGNAME)", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }

      const nameToken = this.consume();

      components.push({
        name: nameToken.value,
        location: nameToken.range,
      });

      this.skipNewlines();
    }

    return {
      type: "Components",
      components,
    };
  }

  /**
   * Parse layout block content with error recovery.
   *
   * @returns LayoutNode
   */
  private parseLayout(): LayoutNode {
    const children = this.parseComponentTree();

    return {
      type: "Layout",
      children,
    };
  }

  /**
   * Parse script block content with error recovery.
   *
   * @returns ScriptNode
   */
  private parseScript(): ScriptNode {
    const events: ScriptProperty[] = [];

    while (!this.match(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      if (this.match(TokenType.RBRACE)) {
        break;
      }

      if (!this.match(TokenType.IDENTIFIER)) {
        this.recordError("Expected event key (IDENTIFIER)", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }

      const keyToken = this.consume();

      if (!this.match(TokenType.COLON)) {
        this.recordError("Expected COLON after event key", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }
      this.consume();

      if (!this.match(TokenType.STRING)) {
        this.recordError("Expected STRING for event value", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        continue;
      }

      const valueToken = this.consume();

      const location: Range = {
        start: keyToken.range.start,
        end: valueToken.range.end,
      };

      events.push({
        key: keyToken.value,
        value: valueToken.value,
        location,
      });

      this.skipNewlines();
    }

    return {
      type: "Script",
      events,
    };
  }

  // ========================================================================
  // Layout Tree Parsing
  // ========================================================================

  /**
   * Parse a component tree with error recovery.
   *
   * @returns Array of LayoutElements
   */
  private parseComponentTree(): LayoutElement[] {
    const elements: LayoutElement[] = [];

    while (!this.match(TokenType.RBRACE) && !this.isAtEnd()) {
      this.skipNewlines();

      if (this.match(TokenType.RBRACE)) {
        break;
      }

      const element = this.parseElement();
      if (element) {
        elements.push(element);
      }

      this.skipNewlines();
    }

    return elements;
  }

  /**
   * Parse a single layout element with error recovery.
   *
   * @returns LayoutElement or null
   */
  private parseElement(): LayoutElement | null {
    const token = this.peek();

    if (this.isTextString(token)) {
      return this.parseText();
    }

    if (token.type === TokenType.TAGNAME) {
      return this.parseComponent();
    }

    this.recordError(`Expected component or text, got ${token.type}`, token.range.start);
    this.skipUntilRecoveryPoint();
    return null;
  }

  /**
   * Parse a text node with error recovery.
   *
   * @returns LayoutText or null
   */
  private parseText(): LayoutText | null {
    if (!this.match(TokenType.STRING)) {
      this.recordError("Expected STRING for text node", this.peek().range.start);
      return null;
    }

    const token = this.consume();

    return {
      type: "Text",
      value: token.value,
      location: token.range,
    };
  }

  /**
   * Parse a component node with error recovery.
   *
   * @returns LayoutComponent or null
   */
  private parseComponent(): LayoutComponent | null {
    if (!this.match(TokenType.TAGNAME)) {
      this.recordError("Expected TAGNAME for component", this.peek().range.start);
      return null;
    }

    const tagToken = this.consume();
    const tag = tagToken.value;

    let attributes: Attribute[] = [];
    if (this.match(TokenType.LPAREN)) {
      this.consume();
      attributes = this.parseAttributes();
      if (!this.match(TokenType.RPAREN)) {
        this.recordError("Expected RPAREN after attributes", this.peek().range.start);
        this.skipUntilRecoveryPoint();
      } else {
        this.consume();
      }
    }

    let children: LayoutElement[] = [];
    this.skipNewlines();

    if (this.match(TokenType.LBRACE)) {
      this.consume();
      this.skipNewlines();
      children = this.parseComponentTree();
      if (!this.match(TokenType.RBRACE)) {
        this.recordError("Expected RBRACE to close component", this.peek().range.start);
        this.skipUntilRecoveryPoint();
      } else {
        this.consume();
      }
    }

    const location: Range = {
      start: tagToken.range.start,
      end: this.tokens[this.current - 1].range.end,
    };

    return {
      type: "Component",
      tag,
      attributes,
      children,
      location,
    };
  }

  // ========================================================================
  // Helper Parsing Functions
  // ========================================================================

  /**
   * Parse component attributes with error recovery.
   *
   * @returns Array of Attributes
   */
  private parseAttributes(): Attribute[] {
    const attributes: Attribute[] = [];

    while (!this.match(TokenType.RPAREN) && !this.isAtEnd()) {
      if (!this.match(TokenType.IDENTIFIER)) {
        this.recordError("Expected attribute key (IDENTIFIER)", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        break;
      }

      const keyToken = this.consume();

      if (!this.match(TokenType.COLON)) {
        this.recordError("Expected COLON after attribute key", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        break;
      }
      this.consume();

      if (!this.match(TokenType.STRING)) {
        this.recordError("Expected STRING for attribute value", this.peek().range.start);
        this.skipUntilRecoveryPoint();
        break;
      }

      const valueToken = this.consume();

      const location: Range = {
        start: keyToken.range.start,
        end: valueToken.range.end,
      };

      attributes.push({
        key: keyToken.value,
        value: valueToken.value,
        location,
      });

      if (this.match(TokenType.COMMA)) {
        this.consume();
      }
    }

    return attributes;
  }

  /**
   * Parse a literal value with error recovery.
   *
   * @returns string | number | boolean | null
   */
  private parseLiteral(): string | number | boolean | null {
    const token = this.peek();

    if (token.type === TokenType.STRING) {
      this.consume();
      return token.value;
    }

    if (token.type === TokenType.NUMBER) {
      this.consume();
      return parseFloat(token.value);
    }

    if (token.type === TokenType.BOOLEAN) {
      this.consume();
      return token.value === "true";
    }

    this.recordError(`Expected literal value, got ${token.type}`, token.range.start);
    return null;
  }

  // ========================================================================
  // TEXT_STRING Determination
  // ========================================================================

  /**
   * Determine if a token is a TEXT_STRING.
   *
   * @param token - Token to check
   * @returns true if token is TEXT_STRING
   */
  private isTextString(token: Token): boolean {
    if (token.type !== TokenType.STRING) {
      return false;
    }

    if (token.modeAtToken === TokenizerMode.ATTRIBUTES) {
      return false;
    }

    const prevToken = this.getPreviousNonNewlineToken();

    return prevToken !== null && prevToken.type === TokenType.LBRACE;
  }

  /**
   * Get the previous non-newline token.
   *
   * @returns Previous non-newline token or null
   */
  private getPreviousNonNewlineToken(): Token | null {
    for (let i = this.current - 1; i >= 0; i--) {
      if (this.tokens[i].type !== TokenType.NEWLINE) {
        return this.tokens[i];
      }
    }
    return null;
  }

  // ========================================================================
  // Token Access Functions
  // ========================================================================

  /**
   * Peek at the current token without consuming it.
   *
   * @returns Current token
   */
  private peek(): Token {
    return this.tokens[this.current];
  }

  /**
   * Consume the current token and move to the next.
   *
   * @returns The consumed token
   */
  private consume(): Token {
    const token = this.tokens[this.current];
    this.current++;
    return token;
  }

  /**
   * Check if the current token matches any of the given types.
   *
   * @param types - Token types to match
   * @returns true if current token matches any type
   */
  private match(...types: TokenType[]): boolean {
    const token = this.peek();
    return types.includes(token.type);
  }

  /**
   * Check if we've reached the end of the token stream.
   *
   * @returns true if at EOF
   */
  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  /**
   * Skip consecutive newline tokens.
   */
  private skipNewlines(): void {
    while (this.match(TokenType.NEWLINE)) {
      this.consume();
    }
  }

  // ========================================================================
  // Error Handling & Recovery
  // ========================================================================

  /**
   * Record a parser error without throwing.
   *
   * @param message - Error message
   * @param position - Location where error occurred
   */
  private recordError(message: string, position: { line: number; column: number }): void {
    this.errors.push({
      message,
      line: position.line,
      column: position.column,
    });
  }

  /**
   * Skip tokens until recovery point.
   *
   * Recovery points: NEWLINE, RBRACE, EOF
   */
  private skipUntilRecoveryPoint(): void {
    while (!this.isAtEnd()) {
      const token = this.peek();
      if (token.type === TokenType.NEWLINE || token.type === TokenType.RBRACE || token.type === TokenType.EOF) {
        break;
      }
      this.consume();
    }
  }
}

// ========================================================================
// Export Convenience Function
// ========================================================================

/**
 * Parse a token stream into an AST with error collection.
 *
 * @param tokens - Token stream from Tokenizer
 * @returns ParseResult with AST and errors
 */
export function parse(tokens: Token[]): ParseResult {
  const parser = new Parser(tokens);
  return parser.parseFile();
}
