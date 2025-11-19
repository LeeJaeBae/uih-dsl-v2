/**
 * UIH DSL Tokenizer implementation entrypoint.
 *
 * Refactored to be fully deterministic and spec-compliant.
 * The tokenizer operates as a mode-based FSM without semantic interpretation.
 * Context-aware token classification (e.g., TEXT_STRING) is delegated to the Parser.
 *
 * @module @src/tokenizer
 * @version 2.1.0
 */

import {
  Token,
  TokenType,
  Position,
  TokenizerMode,
} from "./types.js";

/**
 * Stateful tokenizer that converts UIH DSL source text into a token stream.
 *
 * Design principles:
 * - Deterministic character-by-character scanning
 * - Mode-based FSM for context handling (NORMAL, ATTRIBUTES, STRING_LITERAL)
 * - No semantic interpretation (Parser's responsibility)
 * - Strict validation of forbidden characters and syntax rules
 *
 * v2.1 improvements:
 * - Token metadata: modeAtToken, rawIndex
 * - isPotentialLayoutStart flag for "layout" identifiers
 * - FSM-based Identifier/TagName parsing (no regex duplication)
 * - STRING_LITERAL mode properly utilized
 * - Improved backslash handling in forbidden characters
 *
 * @public
 */
export class Tokenizer {
  private input: string;
  private index: number = 0;
  private line: number = 1;
  private column: number = 1;
  private tokens: Token[] = [];

  // FSM mode stack
  private mode: TokenizerMode = TokenizerMode.NORMAL;
  private modeStack: TokenizerMode[] = [];

  /**
   * Create a new tokenizer instance.
   *
   * @param input - Raw DSL source text (LF line endings, no tabs).
   * @throws {Error} If CRLF or tab characters are detected.
   */
  constructor(input: string) {
    // Validate input - no CRLF, no tabs
    if (input.includes("\r\n")) {
      throw new Error("CRLF line endings not allowed. Use LF (\\n) only.");
    }
    if (input.includes("\t")) {
      throw new Error(
        "Tab characters not allowed. Use spaces for indentation."
      );
    }

    this.input = input;
  }

  /**
   * Convert the current input into a list of tokens.
   *
   * @returns Ordered list of tokens ending with `TokenType.EOF`.
   */
  public tokenize(): Token[] {
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

    // Add EOF token
    this.tokens.push(
      this.createToken(
        TokenType.EOF,
        "",
        this.getPosition(),
        this.getPosition()
      )
    );

    return this.tokens;
  }

  /**
   * Read the next token from the input stream.
   *
   * @returns The next token or `null` if no token can be produced.
   * @throws {Error} When encountering forbidden/unexpected characters.
   */
  private nextToken(): Token | null {
    const startPos = this.getPosition();
    const char = this.peek();

    // Check for forbidden characters first (but not backslash in strings)
    if (this.mode !== TokenizerMode.STRING_LITERAL && this.isForbiddenChar(char)) {
      throw this.createError(`Forbidden character '${char}'`, startPos);
    }

    // Newline
    if (char === "\n") {
      this.advance();
      this.line++;
      this.column = 1;
      return this.createToken(
        TokenType.NEWLINE,
        "\n",
        startPos,
        this.getPosition()
      );
    }

    // Symbols
    if (char === "{") {
      this.advance();
      return this.createToken(
        TokenType.LBRACE,
        "{",
        startPos,
        this.getPosition()
      );
    }
    if (char === "}") {
      this.advance();
      return this.createToken(
        TokenType.RBRACE,
        "}",
        startPos,
        this.getPosition()
      );
    }
    if (char === "(") {
      this.advance();
      this.pushMode(TokenizerMode.ATTRIBUTES);
      return this.createToken(
        TokenType.LPAREN,
        "(",
        startPos,
        this.getPosition()
      );
    }
    if (char === ")") {
      this.advance();
      this.popMode();
      return this.createToken(
        TokenType.RPAREN,
        ")",
        startPos,
        this.getPosition()
      );
    }
    if (char === ":") {
      this.advance();
      return this.createToken(
        TokenType.COLON,
        ":",
        startPos,
        this.getPosition()
      );
    }
    if (char === ",") {
      this.advance();
      return this.createToken(
        TokenType.COMMA,
        ",",
        startPos,
        this.getPosition()
      );
    }

    // String
    if (char === '"') {
      return this.readString();
    }

    // Number
    if (this.isDigit(char)) {
      return this.readNumber();
    }

    // Identifier or TagName or Boolean
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
  private readString(): Token {
    const startPos = this.getPosition();
    let value = "";

    // Enter STRING_LITERAL mode
    this.pushMode(TokenizerMode.STRING_LITERAL);

    this.advance(); // Skip opening quote

    while (this.index < this.input.length && this.peek() !== '"') {
      if (this.peek() === "\\") {
        // Handle escape sequences - Strategy A: only \" allowed
        const escapePos = this.getPosition();
        this.advance(); // Skip backslash
        const nextChar = this.peek();

        if (nextChar === '"') {
          // Only valid escape: \"
          value += '"';
          this.advance();
        } else {
          // All other escapes are errors
          this.popMode(); // Exit mode before throwing
          throw this.createError(
            `Invalid escape sequence '\\${nextChar}' - only \\" is allowed in strings`,
            escapePos
          );
        }
      } else if (this.peek() === "\n") {
        // Exit STRING_LITERAL mode before throwing
        this.popMode();
        throw this.createError(
          "Unterminated string (newline not allowed)",
          this.getPosition()
        );
      } else {
        value += this.peek();
        this.advance();
      }
    }

    if (this.index >= this.input.length) {
      // Exit STRING_LITERAL mode before throwing
      this.popMode();
      throw this.createError("Unterminated string (EOF)", startPos);
    }

    this.advance(); // Skip closing quote

    // Exit STRING_LITERAL mode
    this.popMode();

    // All strings are STRING tokens - Parser determines if it's text content
    return this.createToken(TokenType.STRING, value, startPos, this.getPosition());
  }

  /**
   * Read a numeric literal supporting optional decimals.
   *
   * @returns The parsed number token.
   */
  private readNumber(): Token {
    const startPos = this.getPosition();
    let value = "";

    // Read integer part
    while (this.isDigit(this.peek())) {
      value += this.peek();
      this.advance();
    }

    // Read decimal part if exists
    if (this.peek() === "." && this.isDigit(this.peekNext())) {
      value += ".";
      this.advance();

      while (this.isDigit(this.peek())) {
        value += this.peek();
        this.advance();
      }
    }

    return this.createToken(
      TokenType.NUMBER,
      value,
      startPos,
      this.getPosition()
    );
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
  private readIdentifierOrTagName(): Token {
    const startPos = this.getPosition();
    let value = "";

    // Check if uppercase (TagName) or lowercase (Identifier)
    const firstChar = this.peek();
    const isTagName = this.isUpperCase(firstChar);

    if (isTagName) {
      // TagName FSM: [A-Z][a-zA-Z0-9]*
      value += firstChar;
      this.advance();

      while (this.index < this.input.length) {
        const char = this.peek();

        if (this.isLetter(char) || this.isDigit(char)) {
          value += char;
          this.advance();
        } else if (char === "_") {
          // Explicitly forbid underscore
          throw this.createError(
            "TagName cannot contain underscores",
            this.getPosition()
          );
        } else {
          // End of TagName
          break;
        }
      }

      return this.createToken(
        TokenType.TAGNAME,
        value,
        startPos,
        this.getPosition()
      );
    } else {
      // Identifier FSM: [a-z][a-z0-9.]* with validation
      if (!this.isLowerCase(firstChar)) {
        throw this.createError(
          "Identifier must start with lowercase letter",
          startPos
        );
      }

      value += firstChar;
      this.advance();

      let lastWasDot = false;

      while (this.index < this.input.length) {
        const char = this.peek();

        if (this.isLowerCase(char) || this.isDigit(char)) {
          value += char;
          lastWasDot = false;
          this.advance();
        } else if (char === ".") {
          // Check for consecutive dots
          if (lastWasDot) {
            throw this.createError(
              "Identifier cannot contain consecutive dots",
              this.getPosition()
            );
          }
          value += char;
          lastWasDot = true;
          this.advance();
        } else {
          // End of Identifier
          break;
        }
      }

      // Validate no trailing dot
      if (value.endsWith(".")) {
        throw this.createError(
          "Identifier cannot end with a dot",
          this.getPosition()
        );
      }

      // Check for boolean keywords
      if (value === "true" || value === "false") {
        return this.createToken(
          TokenType.BOOLEAN,
          value,
          startPos,
          this.getPosition()
        );
      }

      // Create identifier token with optional layout flag
      return this.createToken(
        TokenType.IDENTIFIER,
        value,
        startPos,
        this.getPosition(),
        value === "layout" // isPotentialLayoutStart
      );
    }
  }

  /**
   * Skip plain space characters (not tabs, not newlines).
   * Only spaces are skipped - newlines are tokenized.
   */
  private skipWhitespace(): void {
    while (this.peek() === " ") {
      this.advance();
    }
  }

  /**
   * Push the current tokenizer mode onto the stack and switch to a new mode.
   *
   * @param mode - Mode to activate.
   */
  private pushMode(mode: TokenizerMode): void {
    this.modeStack.push(this.mode);
    this.mode = mode;
  }

  /**
   * Restore the previous tokenizer mode if one exists on the stack.
   */
  private popMode(): void {
    if (this.modeStack.length > 0) {
      this.mode = this.modeStack.pop()!;
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
  private peek(): string {
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
  private peekNext(): string {
    if (this.index + 1 >= this.input.length) {
      return "";
    }
    return this.input[this.index + 1];
  }

  /**
   * Move forward by one character, updating column tracking.
   */
  private advance(): void {
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
  private getPosition(): Position {
    return {
      line: this.line,
      column: this.column,
      index: this.index,
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
  private createToken(
    type: TokenType,
    value: string,
    start: Position,
    end: Position,
    isPotentialLayoutStart?: boolean
  ): Token {
    const token: Token = {
      type,
      value,
      range: { start, end },
      modeAtToken: this.mode, // v2.1: Record mode when token was created
      rawIndex: start.index, // v2.1: Original index in source
    };

    // Add optional flag if provided
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
  private createError(message: string, position: Position): Error {
    return new Error(
      `Tokenizer Error at line ${position.line}, column ${position.column}: ${message}`
    );
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
  private isLetter(char: string): boolean {
    return /[a-zA-Z]/.test(char);
  }

  /**
   * Check whether the provided character is numeric.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[0-9]`.
   */
  private isDigit(char: string): boolean {
    return /[0-9]/.test(char);
  }

  /**
   * Determine if the character is uppercase alphabetic.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[A-Z]`.
   */
  private isUpperCase(char: string): boolean {
    return /[A-Z]/.test(char);
  }

  /**
   * Determine if the character is lowercase alphabetic.
   *
   * @param char - Character to check.
   * @returns `true` when the character is within `[a-z]`.
   */
  private isLowerCase(char: string): boolean {
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
  private isForbiddenChar(char: string): boolean {
    const forbidden = [
      ";",  // semicolon
      "'",  // single quote
      "`",  // backtick
      "@",  // at sign
      "#",  // hash
      "$",  // dollar
      "%",  // percent
      "^",  // caret
      "&",  // ampersand
      "*",  // asterisk
      "=",  // equals
      "+",  // plus
      "|",  // pipe
      "\\", // backslash (forbidden outside strings, allowed inside for \")
      "<",  // less than
      ">",  // greater than
      "?",  // question mark
      "~",  // tilde
    ];
    return forbidden.includes(char);
  }
}

// Export main tokenize function
/**
 * Convenience wrapper that tokenizes the provided DSL source text.
 *
 * @param input - Raw DSL source text.
 * @returns Token list produced by `Tokenizer`.
 */
export function tokenize(input: string): Token[] {
  const tokenizer = new Tokenizer(input);
  return tokenizer.tokenize();
}
