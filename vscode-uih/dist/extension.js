"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode = __toESM(require("vscode"));

// ../compiler/packages/tokenizer/dist/types.js
var TokenType;
(function(TokenType2) {
  TokenType2["IDENTIFIER"] = "IDENTIFIER";
  TokenType2["TAGNAME"] = "TAGNAME";
  TokenType2["STRING"] = "STRING";
  TokenType2["NUMBER"] = "NUMBER";
  TokenType2["BOOLEAN"] = "BOOLEAN";
  TokenType2["LBRACE"] = "LBRACE";
  TokenType2["RBRACE"] = "RBRACE";
  TokenType2["LPAREN"] = "LPAREN";
  TokenType2["RPAREN"] = "RPAREN";
  TokenType2["COLON"] = "COLON";
  TokenType2["COMMA"] = "COMMA";
  TokenType2["NEWLINE"] = "NEWLINE";
  TokenType2["EOF"] = "EOF";
})(TokenType || (TokenType = {}));
var TokenizerMode;
(function(TokenizerMode2) {
  TokenizerMode2["NORMAL"] = "NORMAL";
  TokenizerMode2["ATTRIBUTES"] = "ATTRIBUTES";
  TokenizerMode2["STRING_LITERAL"] = "STRING_LITERAL";
})(TokenizerMode || (TokenizerMode = {}));

// ../compiler/packages/tokenizer/dist/tokenizer.js
var Tokenizer = class {
  input;
  index = 0;
  line = 1;
  column = 1;
  tokens = [];
  // FSM mode stack
  mode = TokenizerMode.NORMAL;
  modeStack = [];
  /**
   * Create a new tokenizer instance.
   *
   * @param input - Raw DSL source text (LF line endings, no tabs).
   * @throws {Error} If CRLF or tab characters are detected.
   */
  constructor(input) {
    if (input.includes("\r\n")) {
      throw new Error("CRLF line endings not allowed. Use LF (\\n) only.");
    }
    if (input.includes("	")) {
      throw new Error("Tab characters not allowed. Use spaces for indentation.");
    }
    this.input = input;
  }
  /**
   * Convert the current input into a list of tokens.
   *
   * @returns Ordered list of tokens ending with `TokenType.EOF`.
   */
  tokenize() {
    this.tokens = [];
    this.index = 0;
    this.line = 1;
    this.column = 1;
    this.mode = TokenizerMode.NORMAL;
    this.modeStack = [];
    while (this.index < this.input.length) {
      this.skipWhitespace();
      if (this.index >= this.input.length) {
        break;
      }
      const token = this.nextToken();
      if (token) {
        this.tokens.push(token);
      }
    }
    this.tokens.push(this.createToken(TokenType.EOF, "", this.getPosition(), this.getPosition()));
    return this.tokens;
  }
  /**
   * Read the next token from the input stream.
   *
   * @returns The next token or `null` if no token can be produced.
   * @throws {Error} When encountering forbidden/unexpected characters.
   */
  nextToken() {
    const startPos = this.getPosition();
    const char = this.peek();
    if (this.mode !== TokenizerMode.STRING_LITERAL && this.isForbiddenChar(char)) {
      throw this.createError(`Forbidden character '${char}'`, startPos);
    }
    if (char === "/") {
      if (this.peekNext() === "/") {
        while (this.peek() !== "\n" && this.index < this.input.length) {
          this.advance();
        }
        return this.nextToken();
      } else {
        throw this.createError("Unexpected character '/' (only // comments allowed)", startPos);
      }
    }
    if (char === "\n") {
      this.advance();
      this.line++;
      this.column = 1;
      return this.createToken(TokenType.NEWLINE, "\n", startPos, this.getPosition());
    }
    if (char === "{") {
      this.advance();
      return this.createToken(TokenType.LBRACE, "{", startPos, this.getPosition());
    }
    if (char === "}") {
      this.advance();
      return this.createToken(TokenType.RBRACE, "}", startPos, this.getPosition());
    }
    if (char === "(") {
      this.advance();
      this.pushMode(TokenizerMode.ATTRIBUTES);
      return this.createToken(TokenType.LPAREN, "(", startPos, this.getPosition());
    }
    if (char === ")") {
      this.advance();
      this.popMode();
      return this.createToken(TokenType.RPAREN, ")", startPos, this.getPosition());
    }
    if (char === ":") {
      this.advance();
      return this.createToken(TokenType.COLON, ":", startPos, this.getPosition());
    }
    if (char === ",") {
      this.advance();
      return this.createToken(TokenType.COMMA, ",", startPos, this.getPosition());
    }
    if (char === '"') {
      return this.readString();
    }
    if (this.isDigit(char)) {
      return this.readNumber();
    }
    if (this.isLetter(char)) {
      return this.readIdentifierOrTagName();
    }
    throw this.createError(`Unexpected character '${char}'`, startPos);
  }
  /**
   * Read a quoted string literal with STRING_LITERAL mode.
   * All strings are tokenized as STRING - context interpretation is Parser's job.
   *
   * Escape sequence policy (Strategy A - Minimal):
   * - Only \" is allowed (escaped quote)
   * - All other escape sequences are errors
   * - This keeps the language simple and predictable
   *
   * @returns The parsed string token.
   * @throws {Error} If a newline, EOF, or invalid escape is encountered.
   */
  readString() {
    const startPos = this.getPosition();
    let value = "";
    this.pushMode(TokenizerMode.STRING_LITERAL);
    this.advance();
    while (this.index < this.input.length && this.peek() !== '"') {
      if (this.peek() === "\\") {
        const escapePos = this.getPosition();
        this.advance();
        const nextChar = this.peek();
        if (nextChar === '"') {
          value += '"';
          this.advance();
        } else {
          this.popMode();
          throw this.createError(`Invalid escape sequence '\\${nextChar}' - only \\" is allowed in strings`, escapePos);
        }
      } else if (this.peek() === "\n") {
        this.popMode();
        throw this.createError("Unterminated string (newline not allowed)", this.getPosition());
      } else {
        value += this.peek();
        this.advance();
      }
    }
    if (this.index >= this.input.length) {
      this.popMode();
      throw this.createError("Unterminated string (EOF)", startPos);
    }
    this.advance();
    this.popMode();
    return this.createToken(TokenType.STRING, value, startPos, this.getPosition());
  }
  /**
   * Read a numeric literal supporting optional decimals.
   *
   * @returns The parsed number token.
   */
  readNumber() {
    const startPos = this.getPosition();
    let value = "";
    while (this.isDigit(this.peek())) {
      value += this.peek();
      this.advance();
    }
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      value += ".";
      this.advance();
      while (this.isDigit(this.peek())) {
        value += this.peek();
        this.advance();
      }
    }
    return this.createToken(TokenType.NUMBER, value, startPos, this.getPosition());
  }
  /**
   * Read identifiers, booleans, or tag names using FSM-based parsing.
   * No regex duplication - single pass validation.
   *
   * Rules:
   * - Identifier: lowercase start, then lowercase + digits + dots
   *   - No consecutive dots
   *   - No leading/trailing dots
   * - TagName: uppercase start, then alphanumeric only (no underscores)
   *
   * @returns The parsed identifier-related token.
   * @throws {Error} If identifier/tagname rules are violated.
   */
  readIdentifierOrTagName() {
    const startPos = this.getPosition();
    let value = "";
    const firstChar = this.peek();
    const isTagName = this.isUpperCase(firstChar);
    if (isTagName) {
      value += firstChar;
      this.advance();
      while (this.index < this.input.length) {
        const char = this.peek();
        if (this.isLetter(char) || this.isDigit(char) || char === "_" || char === "-") {
          value += char;
          this.advance();
        } else {
          break;
        }
      }
      return this.createToken(TokenType.TAGNAME, value, startPos, this.getPosition());
    } else {
      if (!this.isLowerCase(firstChar)) {
        throw this.createError("Identifier must start with lowercase letter", startPos);
      }
      value += firstChar;
      this.advance();
      let lastWasDot = false;
      while (this.index < this.input.length) {
        const char = this.peek();
        if (this.isLowerCase(char) || this.isUpperCase(char) || this.isDigit(char) || char === "-" || char === "_") {
          value += char;
          lastWasDot = false;
          this.advance();
        } else if (char === ".") {
          if (lastWasDot) {
            throw this.createError("Identifier cannot contain consecutive dots", this.getPosition());
          }
          value += char;
          lastWasDot = true;
          this.advance();
        } else {
          break;
        }
      }
      if (value.endsWith(".")) {
        throw this.createError("Identifier cannot end with a dot", this.getPosition());
      }
      if (value === "true" || value === "false") {
        return this.createToken(TokenType.BOOLEAN, value, startPos, this.getPosition());
      }
      return this.createToken(
        TokenType.IDENTIFIER,
        value,
        startPos,
        this.getPosition(),
        value === "layout"
        // isPotentialLayoutStart
      );
    }
  }
  /**
   * Skip plain space characters (not tabs, not newlines).
   * Only spaces are skipped - newlines are tokenized.
   */
  skipWhitespace() {
    while (this.peek() === " ") {
      this.advance();
    }
  }
  /**
   * Push the current tokenizer mode onto the stack and switch to a new mode.
   *
   * @param mode - Mode to activate.
   */
  pushMode(mode) {
    this.modeStack.push(this.mode);
    this.mode = mode;
  }
  /**
   * Restore the previous tokenizer mode if one exists on the stack.
   */
  popMode() {
    if (this.modeStack.length > 0) {
      this.mode = this.modeStack.pop();
    }
  }
  // ========================================================================
  // Helper methods
  // ========================================================================
  /**
   * Peek at the current character without consuming it.
   *
   * @returns The current character or empty string when at EOF.
   */
  peek() {
    if (this.index >= this.input.length) {
      return "";
    }
    return this.input[this.index];
  }
  /**
   * Peek ahead by one character without consuming it.
   *
   * @returns The next character or empty string when beyond EOF.
   */
  peekNext() {
    if (this.index + 1 >= this.input.length) {
      return "";
    }
    return this.input[this.index + 1];
  }
  /**
   * Move forward by one character, updating column tracking.
   */
  advance() {
    if (this.index < this.input.length) {
      this.index++;
      this.column++;
    }
  }
  /**
   * Capture the current cursor position.
   *
   * @returns The current `Position` snapshot.
   */
  getPosition() {
    return {
      line: this.line,
      column: this.column,
      index: this.index
    };
  }
  /**
   * Build a token using the provided metadata.
   * v2.1: Includes modeAtToken, rawIndex, and optional isPotentialLayoutStart.
   *
   * @param type - Token type identifier.
   * @param value - Raw lexeme value.
   * @param start - Starting position (inclusive).
   * @param end - Ending position (exclusive).
   * @param isPotentialLayoutStart - Optional flag for "layout" identifier.
   * @returns Constructed token object.
   */
  createToken(type, value, start, end, isPotentialLayoutStart) {
    const token = {
      type,
      value,
      range: { start, end },
      modeAtToken: this.mode,
      // v2.1: Record mode when token was created
      rawIndex: start.index
      // v2.1: Original index in source
    };
    if (isPotentialLayoutStart) {
      token.isPotentialLayoutStart = true;
    }
    return token;
  }
  /**
   * Produce a normalized tokenizer error with consistent messaging.
   *
   * @param message - Human readable error detail.
   * @param position - Location where the error occurred.
   * @returns Error instance ready to be thrown.
   */
  createError(message, position) {
    return new Error(`Tokenizer Error at line ${position.line}, column ${position.column}: ${message}`);
  }
  // ========================================================================
  // Character classification helpers
  // ========================================================================
  /**
   * Check whether the provided character is alphabetic.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[a-zA-Z]`.
   */
  isLetter(char) {
    return /[a-zA-Z]/.test(char);
  }
  /**
   * Check whether the provided character is numeric.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[0-9]`.
   */
  isDigit(char) {
    return /[0-9]/.test(char);
  }
  /**
   * Determine if the character is uppercase alphabetic.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[A-Z]`.
   */
  isUpperCase(char) {
    return /[A-Z]/.test(char);
  }
  /**
   * Determine if the character is lowercase alphabetic.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[a-z]`.
   */
  isLowerCase(char) {
    return /[a-z]/.test(char);
  }
  /**
   * Evaluate whether a character is forbidden by the DSL spec.
   *
   * v2.1 Backslash handling:
   * - Outside strings (NORMAL/ATTRIBUTES mode): backslash is FORBIDDEN
   * - Inside strings (STRING_LITERAL mode): backslash is ALLOWED for escape sequences
   * - This is enforced by mode check in nextToken() before calling this function
   * - See nextToken() line 120: `if (this.mode !== TokenizerMode.STRING_LITERAL && ...)`
   *
   * Why backslash is forbidden outside strings:
   * - Prevents confusion with escape sequences
   * - Keeps syntax unambiguous
   * - Forces explicit string literals for special characters
   *
   * Forbidden characters (from README):
   * - ; (semicolon)     - prevents statement separation confusion
   * - ' (single quote)  - enforces double-quote strings only
   * - ` (backtick)      - prevents template literal confusion
   * - @ (at sign)       - reserved for future decorators
   * - # (hash)          - reserved for future directives
   * - $ (dollar)        - reserved for future template syntax
   * - % (percent)       - prevents modulo confusion
   * - ^ (caret)         - prevents XOR confusion
   * - & (ampersand)     - prevents AND confusion
   * - * (asterisk)      - prevents multiplication confusion
   * - = (equals)        - enforces colon for assignment
   * - + (plus)          - prevents addition confusion
   * - | (pipe)          - prevents OR confusion
   * - \ (backslash)     - forbidden outside strings (see above)
   * - < (less than)     - prevents comparison confusion
   * - > (greater than)  - prevents comparison confusion
   * - ? (question mark) - prevents ternary confusion
   * - ~ (tilde)         - prevents NOT confusion
   * - \t (tab)          - checked in constructor
   * - \r\n (CRLF)       - checked in constructor
   *
   * @param char - Character to check.
   * @returns `true` when the character should trigger an error.
   */
  isForbiddenChar(char) {
    const forbidden = [
      ";",
      // semicolon
      "'",
      // single quote
      "`",
      // backtick
      "@",
      // at sign
      "#",
      // hash
      "$",
      // dollar
      "%",
      // percent
      "^",
      // caret
      "&",
      // ampersand
      "*",
      // asterisk
      "=",
      // equals
      "+",
      // plus
      "|",
      // pipe
      "\\",
      // backslash (forbidden outside strings, allowed inside for \")
      "<",
      // less than
      ">",
      // greater than
      "?",
      // question mark
      "~"
      // tilde
    ];
    return forbidden.includes(char);
  }
};
function tokenize(input) {
  const tokenizer = new Tokenizer(input);
  return tokenizer.tokenize();
}

// ../compiler/packages/parser/dist/parser.js
var Parser = class {
  tokens;
  current = 0;
  errors = [];
  /**
   * Create a new parser instance.
   *
   * @param tokens - Token stream from Tokenizer v2.1
   */
  constructor(tokens) {
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
  parseFile() {
    this.errors = [];
    this.current = 0;
    this.skipNewlines();
    const meta = this.parseBlock("meta");
    const style = this.parseBlock("style");
    const components = this.parseBlock("components");
    const layout = this.parseBlock("layout");
    const script = this.parseBlock("script");
    if (!layout) {
      this.recordError("Layout block is required", this.peek().range.start);
    }
    const finalMeta = meta || {
      type: "Meta",
      properties: []
    };
    const finalStyle = style || {
      type: "Style",
      properties: []
    };
    this.skipNewlines();
    if (!this.isAtEnd()) {
      this.recordError(`Unexpected token after script block: ${this.peek().value}`, this.peek().range.start);
      this.skipUntilRecoveryPoint();
    }
    const ast = layout ? {
      type: "Program",
      meta: finalMeta,
      style: finalStyle,
      components,
      layout,
      script
    } : null;
    return {
      ast,
      errors: this.errors
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
  parseBlock(expectedBlockName) {
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
    let result = null;
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
  parseMeta() {
    const properties = [];
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
      const location = {
        start: keyToken.range.start,
        end: this.tokens[this.current - 1].range.end
      };
      properties.push({
        key: keyToken.value,
        value,
        location
      });
      this.skipNewlines();
    }
    return {
      type: "Meta",
      properties
    };
  }
  /**
   * Parse style block content with error recovery.
   *
   * @returns StyleNode
   */
  parseStyle() {
    const properties = [];
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
      const location = {
        start: keyToken.range.start,
        end: this.tokens[this.current - 1].range.end
      };
      properties.push({
        key: keyToken.value,
        value,
        location
      });
      this.skipNewlines();
    }
    return {
      type: "Style",
      properties
    };
  }
  /**
   * Parse components block content with error recovery.
   *
   * @returns ComponentsNode
   */
  parseComponents() {
    const components = [];
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
        location: nameToken.range
      });
      this.skipNewlines();
    }
    return {
      type: "Components",
      components
    };
  }
  /**
   * Parse layout block content with error recovery.
   *
   * @returns LayoutNode
   */
  parseLayout() {
    const children = this.parseComponentTree();
    return {
      type: "Layout",
      children
    };
  }
  /**
   * Parse script block content with error recovery.
   *
   * @returns ScriptNode
   */
  parseScript() {
    const events = [];
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
      const location = {
        start: keyToken.range.start,
        end: valueToken.range.end
      };
      events.push({
        key: keyToken.value,
        value: valueToken.value,
        location
      });
      this.skipNewlines();
    }
    return {
      type: "Script",
      events
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
  parseComponentTree() {
    const elements = [];
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
  parseElement() {
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
  parseText() {
    if (!this.match(TokenType.STRING)) {
      this.recordError("Expected STRING for text node", this.peek().range.start);
      return null;
    }
    const token = this.consume();
    return {
      type: "Text",
      value: token.value,
      location: token.range
    };
  }
  /**
   * Parse a component node with error recovery.
   *
   * @returns LayoutComponent or null
   */
  parseComponent() {
    if (!this.match(TokenType.TAGNAME)) {
      this.recordError("Expected TAGNAME for component", this.peek().range.start);
      return null;
    }
    const tagToken = this.consume();
    const tag = tagToken.value;
    let attributes = [];
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
    let children = [];
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
    const location = {
      start: tagToken.range.start,
      end: this.tokens[this.current - 1].range.end
    };
    return {
      type: "Component",
      tag,
      attributes,
      children,
      location
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
  parseAttributes() {
    const attributes = [];
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
      const location = {
        start: keyToken.range.start,
        end: valueToken.range.end
      };
      attributes.push({
        key: keyToken.value,
        value: valueToken.value,
        location
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
  parseLiteral() {
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
  isTextString(token) {
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
  getPreviousNonNewlineToken() {
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
  peek() {
    return this.tokens[this.current];
  }
  /**
   * Consume the current token and move to the next.
   *
   * @returns The consumed token
   */
  consume() {
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
  match(...types) {
    const token = this.peek();
    return types.includes(token.type);
  }
  /**
   * Check if we've reached the end of the token stream.
   *
   * @returns true if at EOF
   */
  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }
  /**
   * Skip consecutive newline tokens.
   */
  skipNewlines() {
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
  recordError(message, position) {
    this.errors.push({
      message,
      line: position.line,
      column: position.column
    });
  }
  /**
   * Skip tokens until recovery point.
   *
   * Recovery points: NEWLINE, RBRACE, EOF
   */
  skipUntilRecoveryPoint() {
    while (!this.isAtEnd()) {
      const token = this.peek();
      if (token.type === TokenType.NEWLINE || token.type === TokenType.RBRACE || token.type === TokenType.EOF) {
        break;
      }
      this.consume();
    }
  }
};
function parse(tokens) {
  const parser = new Parser(tokens);
  return parser.parseFile();
}

// ../compiler/packages/ir/dist/normalize.js
function normalizeAttributes(attrs) {
  return attrs.map((attr) => ({
    key: attr.key,
    value: attr.value
  })).sort((a, b) => a.key.localeCompare(b.key));
}
function splitStylePath(key) {
  return key.split(".");
}
function isValidStylePath(path) {
  return path.length >= 2;
}
function sortObjectKeys(obj) {
  const sorted = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
function pushError(errors, message, location) {
  errors.push({
    message,
    line: location.line,
    column: location.column
  });
}
function isValidScriptKey(key) {
  const camelCaseRegex = /^[a-z][a-zA-Z0-9]*$/;
  return camelCaseRegex.test(key);
}
function isEmptyScriptValue(value) {
  return value.trim() === "";
}
function sortStringArray(arr) {
  return [...arr].sort();
}
function sortStyleTokens(tokens) {
  return [...tokens].sort((a, b) => {
    const pathA = a.path.join(".");
    const pathB = b.path.join(".");
    return pathA.localeCompare(pathB);
  });
}
function sortScriptEntries(entries) {
  return [...entries].sort((a, b) => a.event.localeCompare(b.event));
}

// ../compiler/packages/ir/dist/translator.js
function createIR(ast, parserErrors) {
  const translationErrors = [];
  const errors = parserErrors.map((err) => ({
    message: err.message,
    line: err.line,
    column: err.column
  }));
  if (ast === null) {
    return {
      meta: {},
      style: { tokens: [] },
      components: [],
      layout: [],
      script: [],
      errors
    };
  }
  const meta = createMetaIR(ast.meta, translationErrors);
  const style = createStyleIR(ast.style, translationErrors);
  const components = createComponentsIR(ast.components);
  const layout = createLayoutIR(ast.layout);
  const script = createScriptIR(ast.script, translationErrors);
  const allErrors = [...errors, ...translationErrors];
  return {
    meta,
    style,
    components,
    layout,
    script,
    errors: allErrors
  };
}
function createMetaIR(node, errors) {
  const meta = {};
  for (const prop of node.properties) {
    if (typeof prop.value === "string" || typeof prop.value === "number" || typeof prop.value === "boolean") {
      meta[prop.key] = prop.value;
    } else {
      pushError(errors, `Meta property '${prop.key}' has invalid value type`, prop.location.start);
    }
  }
  return sortObjectKeys(meta);
}
function createStyleIR(node, errors) {
  const tokens = [];
  for (const prop of node.properties) {
    if (typeof prop.value === "boolean") {
      pushError(errors, `Style property '${prop.key}' cannot have boolean value`, prop.location.start);
      continue;
    }
    const path = splitStylePath(prop.key);
    if (!isValidStylePath(path)) {
      pushError(errors, `Style key '${prop.key}' must use dot notation (e.g., 'color.primary')`, prop.location.start);
      continue;
    }
    tokens.push({
      path,
      value: prop.value
    });
  }
  const sortedTokens = sortStyleTokens(tokens);
  return { tokens: sortedTokens };
}
function createComponentsIR(node) {
  if (!node) {
    return [];
  }
  const names = node.components.map((comp) => comp.name);
  return sortStringArray(names);
}
function createLayoutIR(node) {
  return node.children.map((child) => transformLayoutElement(child));
}
function transformLayoutElement(node) {
  if (node.type === "Component") {
    return transformLayoutComponent(node);
  } else {
    return transformLayoutText(node);
  }
}
function transformLayoutComponent(node) {
  const attrs = normalizeAttributes(node.attributes);
  const children = node.children.map((child) => transformLayoutElement(child));
  return {
    type: "Component",
    tag: node.tag,
    attrs,
    children
  };
}
function transformLayoutText(node) {
  return {
    type: "Text",
    value: node.value
  };
}
function createScriptIR(node, errors) {
  if (!node) {
    return [];
  }
  const entries = [];
  for (const event of node.events) {
    if (!isValidScriptKey(event.key)) {
      pushError(errors, `Script key '${event.key}' must be in camelCase format`, event.location.start);
      continue;
    }
    if (isEmptyScriptValue(event.value)) {
      pushError(errors, `Script handler for '${event.key}' cannot be empty`, event.location.start);
      continue;
    }
    entries.push({
      event: event.key,
      handler: event.value
    });
  }
  return sortScriptEntries(entries);
}

// ../compiler/packages/codegen/react/dist/meta.js
function generateMeta(ir) {
  const keys = Object.keys(ir.meta);
  if (keys.length === 0) {
    return null;
  }
  const entries = keys.map((key) => {
    const value = ir.meta[key];
    const formattedValue = formatMetaValue(value);
    return `  ${key}: ${formattedValue}`;
  });
  return `export const metadata = {
${entries.join(",\n")}
};`;
}
function formatMetaValue(value) {
  if (typeof value === "string") {
    return `"${escapeString(value)}"`;
  }
  return String(value);
}
function escapeString(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

// ../compiler/packages/codegen/react/dist/style.js
function generateStyle(ir) {
  if (ir.style.tokens.length === 0) {
    return null;
  }
  const variables = ir.style.tokens.map((token) => {
    const varName = token.path.join("-");
    const value = formatStyleValue(token.value);
    return `  --${varName}: ${value};`;
  });
  return `:root {
${variables.join("\n")}
}`;
}
function formatStyleValue(value) {
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}

// ../compiler/packages/codegen/react/dist/script.js
function generateScript(ir) {
  const hooks = [];
  const handlers = [];
  ir.script.forEach((entry) => {
    const key = entry.event;
    const value = entry.handler;
    const isStringLiteral = value.startsWith("'") || value.startsWith('"');
    if (value === "true" || value === "false" || !isNaN(Number(value)) || isStringLiteral) {
      const hookName = `[${key}, set${capitalize(key)}]`;
      hooks.push(`const ${hookName} = React.useState(${value});`);
    } else {
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
        handlers.push(`const ${value} = () => {
    console.log("${value} triggered");
  };
`);
      }
    }
  });
  return { hooks, handlers };
}
function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ../compiler/packages/codegen/react/dist/jsx.js
function generateJSX(nodes, indent = 0) {
  return nodes.map((node) => generateNode(node, indent)).join("\n");
}
function mapToHTMLTag(uihTag) {
  const htmlTagMap = {
    // Layout
    Div: "div",
    Section: "section",
    Article: "article",
    Aside: "aside",
    Header: "header",
    Footer: "footer",
    Nav: "nav",
    Main: "main",
    // Text
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    Span: "span",
    Text: "span",
    // Form
    Form: "form",
    Input: "input",
    Textarea: "textarea",
    Button: "button",
    Label: "label",
    Select: "select",
    Option: "option",
    // List
    Ul: "ul",
    Ol: "ol",
    Li: "li",
    // Table
    Table: "table",
    Thead: "thead",
    Tbody: "tbody",
    Tr: "tr",
    Td: "td",
    Th: "th",
    // Media
    Img: "img",
    Image: "img",
    Video: "video",
    Audio: "audio",
    // SVG
    Svg: "svg",
    Path: "path",
    Circle: "circle",
    Rect: "rect",
    Line: "line",
    Polyline: "polyline",
    Polygon: "polyline",
    G: "g",
    Defs: "defs",
    LinearGradient: "linearGradient",
    Stop: "stop",
    // Other
    A: "a",
    Card: "div",
    CardContent: "div",
    Hr: "hr",
    Br: "br"
  };
  return htmlTagMap[uihTag] || uihTag;
}
function generateNode(node, indent) {
  if (node.type === "Text") {
    return generateTextNode(node, indent);
  } else {
    return generateComponentNode(node, indent);
  }
}
function generateTextNode(node, indent) {
  const indentStr = " ".repeat(indent);
  return `${indentStr}{${JSON.stringify(node.value)}}`;
}
var VOID_ELEMENTS = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function generateComponentNode(node, indent) {
  const indentStr = " ".repeat(indent);
  const tag = mapToHTMLTag(node.tag);
  const ifAttr = node.attrs.find((a) => a.key === "if");
  const attrs = node.attrs.filter((a) => a.key !== "if");
  const attrsStr = generateAttributes(attrs);
  const attrsFinal = attrsStr.length > 0 ? " " + attrsStr : "";
  let jsx = "";
  if (node.children.length === 0 || VOID_ELEMENTS.has(tag)) {
    jsx = `${indentStr}<${tag}${attrsFinal} />`;
  } else {
    const childrenStr = generateJSX(node.children, indent + 2);
    jsx = `${indentStr}<${tag}${attrsFinal}>
${childrenStr}
${indentStr}</${tag}>`;
  }
  if (ifAttr) {
    return `${indentStr}{${ifAttr.value} && (
${jsx}
${indentStr})}`;
  }
  return jsx;
}
function generateAttributes(attrs) {
  return attrs.map((attr) => {
    let key = attr.key === "class" ? "className" : attr.key;
    if (!key.startsWith("data-") && !key.startsWith("aria-") && key.includes("-")) {
      key = toCamelCase(key);
    }
    if (key === "style") {
      const transformedStyle = attr.value.replace(/\b([a-z][a-zA-Z0-9]*)\.([a-zA-Z0-9]+)\b/g, "var(--$1-$2)");
      const styleObj = parseStyleString(transformedStyle);
      return `style={${JSON.stringify(styleObj)}}`;
    }
    if (key.startsWith("on")) {
      if (attr.value.includes("toggle(")) {
        const match = attr.value.match(/toggle\((.*)\)/);
        if (match) {
          const target = match[1];
          return `${key}={${"() => set"}${capitalize2(target)}(!${target})}`;
        }
      }
      const assignmentMatch = attr.value.match(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)\s*$/);
      if (assignmentMatch) {
        const target = assignmentMatch[1];
        const value = assignmentMatch[2];
        return `${key}={${"() => set"}${capitalize2(target)}(${value})}`;
      }
    }
    return `${key}="${escapeAttributeValue(attr.value)}"`;
  }).join(" ");
}
function parseStyleString(styleStr) {
  const styleObj = {};
  const rules = styleStr.split(";");
  rules.forEach((rule) => {
    const [prop, ...values] = rule.split(":");
    if (prop && values.length > 0) {
      const key = toCamelCase(prop.trim());
      const value = values.join(":").trim();
      if (key && value) {
        styleObj[key] = value;
      }
    }
  });
  return styleObj;
}
function toCamelCase(str) {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
}
function capitalize2(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
function escapeAttributeValue(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ../compiler/packages/codegen/react/dist/generator.js
var DEFAULT_OPTIONS = {
  componentName: "Page",
  includeComments: true,
  indentSize: 2
};
function generate(ir, options = {}) {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const meta = generateMeta(ir);
  const style = generateStyle(ir);
  const scriptData = generateScript(ir);
  const code = generateFullCode(ir, meta, style, opts, scriptData);
  return {
    code,
    style,
    meta,
    events: scriptData.handlers
    // Backwards compatibility
  };
}
function generateFullCode(ir, meta, style, opts, scriptData) {
  const sections = [];
  const imports = ['import React from "react";'];
  if (ir.components && ir.components.length > 0) {
    ir.components.forEach((component) => {
      imports.push(`import { ${component} } from "@/components/${component}";`);
    });
  }
  sections.push(imports.join("\n"));
  if (opts.includeComments && ir.errors.length > 0) {
    sections.push(generateErrorComments(ir));
  }
  if (meta) {
    sections.push(meta);
  }
  if (style) {
    sections.push(`const styles = ${JSON.stringify(style)};`);
  }
  const componentCode = generateComponent(ir, opts, scriptData);
  sections.push(componentCode);
  return sections.join("\n\n");
}
function generateErrorComments(ir) {
  const errors = ir.errors.map((err) => ` * - ${err.message} (line:${err.line}, col:${err.column})`);
  return `/* UIH WARNINGS:
${errors.join("\n")}
 */`;
}
function generateComponent(ir, opts, scriptData) {
  const jsx = generateJSX(ir.layout, opts.indentSize);
  const body = [...scriptData.hooks, ...scriptData.handlers].join("\n  ");
  return `export default function ${opts.componentName}() {
  ${body}

  return (
${jsx}
  );
}`;
}

// ../compiler/packages/codegen/vue/dist/meta.js
function generateMeta2(ir) {
  const keys = Object.keys(ir.meta);
  if (keys.length === 0) {
    return null;
  }
  const entries = keys.map((key) => {
    const value = ir.meta[key];
    const formattedValue = formatMetaValue2(value);
    return `  ${key}: ${formattedValue}`;
  });
  return `export const routeMeta = {
${entries.join(",\n")}
};`;
}
function formatMetaValue2(value) {
  if (typeof value === "string") {
    return `"${escapeString2(value)}"`;
  }
  return String(value);
}
function escapeString2(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

// ../compiler/packages/codegen/vue/dist/style.js
function generateStyle2(ir) {
  if (ir.style.tokens.length === 0) {
    return null;
  }
  const variables = ir.style.tokens.map((token) => {
    const varName = token.path.join("-");
    const value = formatStyleValue2(token.value);
    return `  --${varName}: ${value};`;
  });
  return `:root {
${variables.join("\n")}
}`;
}
function formatStyleValue2(value) {
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}

// ../compiler/packages/codegen/vue/dist/script.js
function generateScript2(ir) {
  const refs = [];
  const handlers = [];
  ir.script.forEach((entry) => {
    const key = entry.event;
    const value = entry.handler;
    const isStringLiteral = value.startsWith("'") || value.startsWith('"');
    if (value === "true" || value === "false" || !isNaN(Number(value)) || isStringLiteral) {
      refs.push(`const ${key} = ref(${value});`);
    } else {
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
        handlers.push(`const ${value} = () => {
  // TODO: Implement ${key} handler
};`);
      }
    }
  });
  return { refs, handlers };
}
function generateScriptExports2(output) {
  const lines = [];
  if (output.refs.length > 0) {
    lines.push(`import { ref } from 'vue';`);
    lines.push(...output.refs);
  }
  lines.push(...output.handlers);
  if (lines.length === 0) {
    return null;
  }
  return lines.join("\n\n");
}

// ../compiler/packages/codegen/vue/dist/template.js
function generateTemplate(nodes, indent = 0) {
  return nodes.map((node) => generateNode2(node, indent)).join("\n");
}
function mapToHTMLTag2(uihTag) {
  const htmlTagMap = {
    // Layout
    Div: "div",
    Section: "section",
    Article: "article",
    Aside: "aside",
    Header: "header",
    Footer: "footer",
    Nav: "nav",
    Main: "main",
    // Text
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    Span: "span",
    Text: "span",
    // Form
    Form: "form",
    Input: "input",
    Textarea: "textarea",
    Button: "button",
    Label: "label",
    Select: "select",
    Option: "option",
    // List
    Ul: "ul",
    Ol: "ol",
    Li: "li",
    // Table
    Table: "table",
    Thead: "thead",
    Tbody: "tbody",
    Tr: "tr",
    Td: "td",
    Th: "th",
    // Media
    Img: "img",
    Video: "video",
    Audio: "audio",
    // SVG
    Svg: "svg",
    Path: "path",
    Circle: "circle",
    Rect: "rect",
    Line: "line",
    Polyline: "polyline",
    Polygon: "polyline",
    G: "g",
    Defs: "defs",
    LinearGradient: "linearGradient",
    Stop: "stop",
    // Other
    A: "a",
    Card: "div",
    CardContent: "div",
    Hr: "hr",
    Br: "br"
  };
  return htmlTagMap[uihTag] || uihTag;
}
function generateNode2(node, indent) {
  if (node.type === "Text") {
    return generateTextNode2(node, indent);
  } else {
    return generateComponentNode2(node, indent);
  }
}
function generateTextNode2(node, indent) {
  const indentStr = " ".repeat(indent);
  const escaped = escapeTemplateText(node.value);
  return `${indentStr}${escaped}`;
}
var VOID_ELEMENTS2 = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function generateComponentNode2(node, indent) {
  const indentStr = " ".repeat(indent);
  const tag = mapToHTMLTag2(node.tag);
  const ifAttr = node.attrs.find((a) => a.key === "if");
  const attrs = node.attrs.filter((a) => a.key !== "if");
  let attrsStr = generateAttributes2(attrs);
  if (ifAttr) {
    attrsStr = `v-if="${escapeAttributeValue2(ifAttr.value)}" ` + attrsStr;
  }
  attrsStr = attrsStr.trim();
  const attrsFinal = attrsStr.length > 0 ? " " + attrsStr : "";
  if (node.children.length === 0 || VOID_ELEMENTS2.has(tag)) {
    return `${indentStr}<${tag}${attrsFinal} />`;
  }
  const childrenStr = generateTemplate(node.children, indent + 2);
  return `${indentStr}<${tag}${attrsFinal}>
${childrenStr}
${indentStr}</${tag}>`;
}
function generateAttributes2(attrs) {
  return attrs.map((attr) => {
    let key = attr.key;
    let value = attr.value;
    if (key.startsWith("on") && key.length > 2 && key[2] === key[2].toUpperCase()) {
      const eventName = key.slice(2).toLowerCase();
      key = `@${eventName}`;
      if (value.includes("toggle(")) {
        const match = value.match(/toggle\((.*)\)/);
        if (match) {
          const target = match[1].trim();
          value = `${target} = !${target}`;
          return `${key}="${value}"`;
        }
      }
    }
    if (key === "style") {
      value = value.replace(/\b([a-z][a-zA-Z0-9]*)\.([a-zA-Z0-9]+)\b/g, "var(--$1-$2)");
    }
    return `${key}="${escapeAttributeValue2(value)}"`;
  }).join(" ");
}
function escapeTemplateText(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttributeValue2(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ../compiler/packages/codegen/vue/dist/generator.js
var DEFAULT_OPTIONS2 = {
  componentName: "Page",
  includeComments: true,
  indentSize: 2
};
function generate2(ir, options = {}) {
  const opts = { ...DEFAULT_OPTIONS2, ...options };
  const meta = generateMeta2(ir);
  const style = generateStyle2(ir);
  const scriptOutput = generateScript2(ir);
  const scriptCode = generateScriptExports2(scriptOutput);
  const code = generateFullCode2(ir, meta, style, scriptCode, opts);
  return {
    code,
    style,
    meta,
    events: scriptOutput.handlers
  };
}
function generateFullCode2(ir, meta, style, scriptCode, opts) {
  const sections = [];
  const scriptSection = generateScriptSection(ir, meta, scriptCode, opts);
  if (scriptSection) {
    sections.push(scriptSection);
  }
  const templateSection = generateTemplateSection(ir, opts);
  sections.push(templateSection);
  if (style) {
    const styleSection = `<style scoped>
${style}
</style>`;
    sections.push(styleSection);
  }
  return sections.join("\n\n");
}
function generateScriptSection(ir, meta, scriptCode, opts) {
  const scriptParts = [];
  if (opts.includeComments && ir.errors.length > 0) {
    scriptParts.push(generateErrorComments2(ir));
  }
  if (meta) {
    scriptParts.push(meta);
  }
  if (scriptCode) {
    scriptParts.push(scriptCode);
  }
  if (scriptParts.length === 0) {
    return null;
  }
  return `<script setup lang="ts">
${scriptParts.join("\n\n")}
</script>`;
}
function generateTemplateSection(ir, opts) {
  const template = generateTemplate(ir.layout, opts.indentSize);
  return `<template>
${template}
</template>`;
}
function generateErrorComments2(ir) {
  const errors = ir.errors.map((err) => ` * - ${err.message} (line:${err.line}, col:${err.column})`);
  return `/* UIH WARNINGS:
${errors.join("\n")}
 */`;
}

// ../compiler/packages/codegen/svelte/dist/meta.js
function generateMeta3(ir) {
  const keys = Object.keys(ir.meta);
  if (keys.length === 0) {
    return null;
  }
  const exports2 = keys.map((key) => {
    const value = ir.meta[key];
    const formattedValue = formatMetaValue3(value);
    return `export const ${key} = ${formattedValue};`;
  });
  return exports2.join("\n");
}
function formatMetaValue3(value) {
  if (typeof value === "string") {
    return `"${escapeString3(value)}"`;
  }
  return String(value);
}
function escapeString3(str) {
  return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t");
}

// ../compiler/packages/codegen/svelte/dist/style.js
function generateStyle3(ir) {
  if (ir.style.tokens.length === 0) {
    return null;
  }
  const variables = ir.style.tokens.map((token) => {
    const varName = token.path.join("-");
    const value = formatStyleValue3(token.value);
    return `  --${varName}: ${value};`;
  });
  return `:global(:root) {
${variables.join("\n")}
}`;
}
function formatStyleValue3(value) {
  if (typeof value === "number") {
    return String(value);
  }
  return value;
}

// ../compiler/packages/codegen/svelte/dist/script.js
function generateScript3(ir) {
  const state = [];
  const handlers = [];
  ir.script.forEach((entry) => {
    const key = entry.event;
    const value = entry.handler;
    const isStringLiteral = value.startsWith("'") || value.startsWith('"');
    if (value === "true" || value === "false" || !isNaN(Number(value)) || isStringLiteral) {
      state.push(`let ${key} = $state(${value});`);
    } else {
      if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(value)) {
        handlers.push(`function ${value}() {
  // TODO: Implement ${key} handler
}`);
      }
    }
  });
  return { state, handlers };
}
function generateScriptExports3(output) {
  const lines = [...output.state, ...output.handlers];
  if (lines.length === 0) {
    return null;
  }
  return lines.join("\n\n");
}

// ../compiler/packages/codegen/svelte/dist/template.js
function generateTemplate2(nodes, indent = 0) {
  return nodes.map((node) => generateNode3(node, indent)).join("\n");
}
function mapToHTMLTag3(uihTag) {
  const htmlTagMap = {
    // Layout
    Div: "div",
    Section: "section",
    Article: "article",
    Aside: "aside",
    Header: "header",
    Footer: "footer",
    Nav: "nav",
    Main: "main",
    // Text
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    Span: "span",
    Text: "span",
    // Form
    Form: "form",
    Input: "input",
    Textarea: "textarea",
    Button: "button",
    Label: "label",
    Select: "select",
    Option: "option",
    // List
    Ul: "ul",
    Ol: "ol",
    Li: "li",
    // Table
    Table: "table",
    Thead: "thead",
    Tbody: "tbody",
    Tr: "tr",
    Td: "td",
    Th: "th",
    // Media
    Img: "img",
    Video: "video",
    Audio: "audio",
    // SVG
    Svg: "svg",
    Path: "path",
    Circle: "circle",
    Rect: "rect",
    Line: "line",
    Polyline: "polyline",
    Polygon: "polyline",
    G: "g",
    Defs: "defs",
    LinearGradient: "linearGradient",
    Stop: "stop",
    // Other
    A: "a",
    Card: "div",
    CardContent: "div",
    Hr: "hr",
    Br: "br"
  };
  return htmlTagMap[uihTag] || uihTag;
}
function generateNode3(node, indent) {
  if (node.type === "Text") {
    return generateTextNode3(node, indent);
  } else {
    return generateComponentNode3(node, indent);
  }
}
function generateTextNode3(node, indent) {
  const indentStr = " ".repeat(indent);
  const escaped = escapeTemplateText2(node.value);
  return `${indentStr}${escaped}`;
}
var VOID_ELEMENTS3 = /* @__PURE__ */ new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function generateComponentNode3(node, indent) {
  const indentStr = " ".repeat(indent);
  const tag = mapToHTMLTag3(node.tag);
  const ifAttr = node.attrs.find((a) => a.key === "if");
  const attrs = node.attrs.filter((a) => a.key !== "if");
  const attrsStr = generateAttributes3(attrs);
  const attrsFinal = attrsStr.length > 0 ? " " + attrsStr : "";
  let componentCode = "";
  if (node.children.length === 0 || VOID_ELEMENTS3.has(tag)) {
    componentCode = `${indentStr}<${tag}${attrsFinal} />`;
  } else {
    const childrenStr = generateTemplate2(node.children, indent + 2);
    componentCode = `${indentStr}<${tag}${attrsFinal}>
${childrenStr}
${indentStr}</${tag}>`;
  }
  if (ifAttr) {
    return `${indentStr}{#if ${ifAttr.value}}
${componentCode}
${indentStr}{/if}`;
  }
  return componentCode;
}
function generateAttributes3(attrs) {
  return attrs.map((attr) => {
    let key = attr.key;
    let value = attr.value;
    if (key.startsWith("on") && key.length > 2 && key[2] === key[2].toUpperCase()) {
      key = key.toLowerCase();
      if (value.includes("toggle(")) {
        const match = value.match(/toggle\((.*)\)/);
        if (match) {
          const target = match[1].trim();
          return `${key}={() => ${target} = !${target}}`;
        }
      }
      const isExpression = /[\=\+\-\*\/]/.test(value) || value.includes("(") || value.includes(")");
      if (isExpression) {
        return `${key}={() => ${value}}`;
      }
      return `${key}={${value}}`;
    }
    if (key === "style") {
      value = value.replace(/\b([a-z][a-zA-Z0-9]*)\.([a-zA-Z0-9]+)\b/g, "var(--$1-$2)");
    }
    return `${key}="${escapeAttributeValue3(value)}"`;
  }).join(" ");
}
function escapeTemplateText2(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function escapeAttributeValue3(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ../compiler/packages/codegen/svelte/dist/generator.js
var DEFAULT_OPTIONS3 = {
  componentName: "Page",
  includeComments: true,
  indentSize: 2
};
function generate3(ir, options = {}) {
  const opts = { ...DEFAULT_OPTIONS3, ...options };
  const meta = generateMeta3(ir);
  const style = generateStyle3(ir);
  const scriptOutput = generateScript3(ir);
  const scriptCode = generateScriptExports3(scriptOutput);
  const code = generateFullCode3(ir, meta, style, scriptCode, opts);
  return {
    code,
    style,
    meta,
    events: scriptOutput.handlers
  };
}
function generateFullCode3(ir, meta, style, scriptCode, opts) {
  const sections = [];
  const scriptSection = generateScriptSection2(ir, meta, scriptCode, opts);
  if (scriptSection) {
    sections.push(scriptSection);
  }
  const template = generateTemplate2(ir.layout, opts.indentSize);
  sections.push(template);
  if (style) {
    const styleSection = `<style>
${style}
</style>`;
    sections.push(styleSection);
  }
  return sections.join("\n\n");
}
function generateScriptSection2(ir, meta, scriptCode, opts) {
  const scriptParts = [];
  if (opts.includeComments && ir.errors.length > 0) {
    scriptParts.push(generateErrorComments3(ir));
  }
  if (meta) {
    scriptParts.push(meta);
  }
  if (scriptCode) {
    scriptParts.push(scriptCode);
  }
  if (scriptParts.length === 0) {
    return null;
  }
  return `<script lang="ts">
${scriptParts.join("\n\n")}
</script>`;
}
function generateErrorComments3(ir) {
  const errors = ir.errors.map((err) => ` * - ${err.message} (line:${err.line}, col:${err.column})`);
  return `/* UIH WARNINGS:
${errors.join("\n")}
 */`;
}

// src/extension.ts
var import_smart_compile = require("@uih-dsl/cli/src/utils/smart-compile.js");
var import_sdk = __toESM(require("@anthropic-ai/sdk"));
var statusBarItem;
function activate(context) {
  console.log("UIH v2 extension activated with Self-Healing");
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);
  const previewCommand = vscode.commands.registerCommand(
    "uih.preview",
    async () => {
      await handlePreview(context);
    }
  );
  const compileCommand = vscode.commands.registerCommand(
    "uih.compile",
    async () => {
      await handleCompile();
    }
  );
  const saveListener = vscode.workspace.onWillSaveTextDocument(async (e) => {
    if (e.document.languageId !== "uih") return;
    const config2 = vscode.workspace.getConfiguration("uih");
    const autoFixEnabled = config2.get("autoFixOnSave", false);
    if (!autoFixEnabled) return;
    e.waitUntil(attemptAutoFix(e.document));
  });
  context.subscriptions.push(previewCommand, compileCommand, saveListener);
  const config = vscode.workspace.getConfiguration("uih");
  if (config.get("autoPreview")) {
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === "uih") {
        handlePreview(context);
      }
    });
  }
}
async function handlePreview(context) {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "uih") {
    vscode.window.showErrorMessage("Open a .uih file to preview");
    return;
  }
  const uihCode = editor.document.getText();
  try {
    const tokens = tokenize(uihCode);
    const parseResult = parse(tokens);
    if (parseResult.errors.length > 0) {
      const errorMsg = parseResult.errors.map((err) => {
        const loc = err.location ? ` at line ${err.location.line}, column ${err.location.column}` : "";
        return `${err.message}${loc}`;
      }).join("\n");
      vscode.window.showErrorMessage(`Parse errors:
${errorMsg}`);
      return;
    }
    if (!parseResult.ast) {
      vscode.window.showErrorMessage("Failed to parse UIH file");
      return;
    }
    const panel = vscode.window.createWebviewPanel(
      "uihPreview",
      "UIH Live Preview",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: []
      }
    );
    panel.webview.html = getPreviewHtml(parseResult.ast);
  } catch (error) {
    vscode.window.showErrorMessage(`Preview failed: ${error.message}`);
  }
}
async function handleCompile() {
  const editor = vscode.window.activeTextEditor;
  if (!editor || editor.document.languageId !== "uih") {
    vscode.window.showErrorMessage("Open a .uih file to compile");
    return;
  }
  const target = await vscode.window.showQuickPick(["react", "vue", "svelte"], {
    placeHolder: "Select target framework"
  });
  if (!target) {
    return;
  }
  const uihCode = editor.document.getText();
  try {
    const tokens = tokenize(uihCode);
    const parseResult = parse(tokens);
    if (parseResult.errors.length > 0) {
      const errorMsg = parseResult.errors.map((err) => `${err.message}`).join("\n");
      vscode.window.showErrorMessage(`Parse errors:
${errorMsg}`);
      return;
    }
    if (!parseResult.ast) {
      vscode.window.showErrorMessage("Failed to parse UIH file");
      return;
    }
    const irResult = createIR(parseResult.ast, parseResult.errors);
    if (irResult.errors.length > 0) {
      const errorMsg = irResult.errors.map((err) => err.message).join("\n");
      vscode.window.showErrorMessage(`IR errors:
${errorMsg}`);
      return;
    }
    let codeResult;
    let fileExtension;
    let language;
    switch (target) {
      case "react":
        codeResult = generate(irResult);
        fileExtension = ".tsx";
        language = "typescriptreact";
        break;
      case "vue":
        codeResult = generate2(irResult);
        fileExtension = ".vue";
        language = "vue";
        break;
      case "svelte":
        codeResult = generate3(irResult);
        fileExtension = ".svelte";
        language = "svelte";
        break;
      default:
        vscode.window.showErrorMessage(`Unknown target: ${target}`);
        return;
    }
    const fileName = `Page${fileExtension}`;
    const doc = await vscode.workspace.openTextDocument({
      language,
      content: codeResult.code
    });
    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    vscode.window.showInformationMessage(`\u2705 Compiled to ${target}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Compilation failed: ${error.message}`);
  }
}
function getPreviewHtml(ast) {
  const cssVars = ast.style.properties.length > 0 ? generateCSSVariables(ast.style.properties) : "";
  const htmlContent = ast.layout.children.length > 0 ? renderNodes(ast.layout.children) : "<p>No layout found</p>";
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${cssVars}
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}
function generateCSSVariables(properties) {
  const vars = properties.map(({ key, value }) => `  --${key.replace(/\./g, "-")}: ${value};`).join("\n");
  return vars ? `:root {
${vars}
}` : "";
}
function renderNodes(nodes) {
  return nodes.map((node) => renderNode(node)).join("\n");
}
function renderNode(node) {
  if (node.type === "Text") {
    return escapeHtml(node.value);
  }
  if (node.type === "Component") {
    return renderElement(node);
  }
  return "";
}
function renderElement(node) {
  const tagName = getHTMLTag(node.tag);
  const attrs = renderAttributes(node.attributes);
  const children = node.children ? renderNodes(node.children) : "";
  if (["img", "input", "br", "hr"].includes(tagName.toLowerCase())) {
    return `<${tagName}${attrs} />`;
  }
  return `<${tagName}${attrs}>${children}</${tagName}>`;
}
function getHTMLTag(name) {
  const htmlElements = {
    // Layout
    Div: "div",
    Section: "section",
    Article: "article",
    Aside: "aside",
    Header: "header",
    Footer: "footer",
    Nav: "nav",
    Main: "main",
    // Text
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    Span: "span",
    Text: "span",
    // Form
    Form: "form",
    Input: "input",
    Textarea: "textarea",
    Button: "button",
    Label: "label",
    Select: "select",
    Option: "option",
    // List
    Ul: "ul",
    Ol: "ol",
    Li: "li",
    // Table
    Table: "table",
    Thead: "thead",
    Tbody: "tbody",
    Tr: "tr",
    Td: "td",
    Th: "th",
    // Media
    Img: "img",
    Video: "video",
    Audio: "audio",
    // Other
    A: "a",
    Card: "div",
    CardContent: "div"
  };
  return htmlElements[name] || "div";
}
function renderAttributes(attrs) {
  if (!attrs || attrs.length === 0) return "";
  const attrStrings = attrs.map((attr) => {
    const value = escapeHtml(attr.value);
    return `${attr.key}="${value}"`;
  }).join(" ");
  return " " + attrStrings;
}
function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
async function attemptAutoFix(document) {
  const source = document.getText();
  try {
    const tokens = tokenize(source);
    const parseResult = parse(tokens);
    if (parseResult.errors.length === 0) {
      return [];
    }
  } catch {
    return [];
  }
  const config = vscode.workspace.getConfiguration("uih");
  const apiKey = config.get("anthropicApiKey");
  if (!apiKey || apiKey.trim() === "") {
    return [];
  }
  try {
    const result = await (0, import_smart_compile.smartCompile)(source, {
      maxRetries: 1,
      // Only 1 retry for save performance
      retryCallback: async (errors) => {
        const client = new import_sdk.default({ apiKey });
        const systemPrompt = `You are a UIH DSL code generator. UIH is a strict, LLM-friendly UI language.

Grammar Rules:
- Fixed block order: meta {...} \u2192 style {...} \u2192 components {...}? \u2192 layout {...} \u2192 script {...}?
- Property format: key: "value" (colon is REQUIRED)
- Double quotes only (single quotes forbidden)
- 2-space indentation (tabs forbidden)
- No semicolons
- Lowercase identifiers, Uppercase TagNames

Fix ONLY the syntax errors. Do not change the logic or structure unless necessary for syntax correctness.
Return ONLY the corrected UIH code, nothing else.`;
        const response = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `Fix these UIH syntax errors:

Errors:
${errors.map((e) => `- Line ${e.line}: ${e.message}`).join("\n")}

Current code:
\`\`\`uih
${source}
\`\`\`

Return only the corrected UIH code.`
            }
          ]
        });
        let fixedCode = response.content[0].text.trim();
        fixedCode = fixedCode.replace(/^```[\w]*\n/, "").replace(/\n```$/, "").trim();
        return fixedCode;
      }
    });
    if (result.success && result.finalSource !== source) {
      statusBarItem.text = "$(check) UIH Auto-fixed";
      statusBarItem.show();
      setTimeout(() => statusBarItem.hide(), 3e3);
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(source.length)
      );
      return [vscode.TextEdit.replace(fullRange, result.finalSource)];
    }
  } catch (error) {
    console.error("UIH auto-fix failed:", error);
  }
  return [];
}
function deactivate() {
  console.log("UIH v2 extension deactivated");
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map