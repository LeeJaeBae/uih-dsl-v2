/**
 * Shared tokenizer type definitions.
 *
 * @module @src/types
 * @version 1.0.0
 */

/**
 * Token types emitted by the tokenizer.
 *
 * @public
 */
export enum TokenType {
  // Identifiers and names
  IDENTIFIER = "IDENTIFIER", // meta, title, color.primary, class (lowercase start)
  TAGNAME = "TAGNAME", // Div, Header, H1 (uppercase start)

  // Literals
  STRING = "STRING", // "value" - all quoted strings (distinction is Parser's job)
  NUMBER = "NUMBER", // 12, 0.5
  BOOLEAN = "BOOLEAN", // true, false

  // Symbols
  LBRACE = "LBRACE", // {
  RBRACE = "RBRACE", // }
  LPAREN = "LPAREN", // (
  RPAREN = "RPAREN", // )
  COLON = "COLON", // :
  COMMA = "COMMA", // ,

  // Whitespace
  NEWLINE = "NEWLINE", // \n (only newlines are tokenized, spaces are skipped)

  // Special
  EOF = "EOF", // End of file
}

/**
 * Capture an absolute position inside the source text.
 *
 * @public
 */
export interface Position {
  line: number;
  column: number;
  index: number; // Absolute position in string
}

/**
 * Represents a start/end range for any token.
 *
 * @public
 */
export interface Range {
  start: Position;
  end: Position;
}

/**
 * Normalized token record produced by the tokenizer.
 *
 * @public
 */
export interface Token {
  type: TokenType;
  value: string;
  range: Range;

  // v2.1 metadata
  modeAtToken: TokenizerMode; // Mode when this token was created
  rawIndex: number; // Original index in source (same as range.start.index)

  // Optional flags for Parser hints
  /**
   * Set to `true` when this token is an IDENTIFIER with value "layout".
   * Allows Parser to quickly identify potential layout block starts without string comparison.
   * Parser should verify that the next non-whitespace token is LBRACE to confirm layout block.
   */
  isPotentialLayoutStart?: boolean;

  /**
   * Set to `true` when this token is an IDENTIFIER with value "state".
   * Allows Parser to identify potential state block starts.
   */
  isPotentialStateStart?: boolean;
}

/**
 * Tokenizer context modes used for FSM-based tokenization.
 *
 * @public
 */
export enum TokenizerMode {
  NORMAL = "NORMAL", // Default mode for top-level constructs
  ATTRIBUTES = "ATTRIBUTES", // Inside component attributes (between parentheses)
  STRING_LITERAL = "STRING_LITERAL", // Inside a string literal
}

/**
 * Shape of tokenizer error payloads.
 *
 * @public
 */
export interface TokenizerError {
  message: string;
  position: Position;
  char?: string;
}
