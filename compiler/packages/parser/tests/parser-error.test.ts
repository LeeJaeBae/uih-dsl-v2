/**
 * UIH DSL Parser v1 - Error Test Suite
 *
 * Tests parser error handling and error message accuracy.
 * Verifies that parser produces correct error messages for invalid input.
 *
 * @module tests/parser-error
 */

import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "../src/parser.js";

describe("Parser Error Tests", () => {
  /**
   * Test: Missing layout block (required)
   */
  it("should error when layout block is missing", () => {
    const input = `
meta {
  title: "Test"
}

style {
  color.primary: "#000"
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(ast).toBeNull();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain("Layout block is required");
  });

  /**
   * Test: Missing closing brace
   */
  it("should error when closing brace is missing", () => {
    const input = `
layout {
  Div {
    "Hello"
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected RBRACE/))).toBe(true);
  });

  /**
   * Test: Missing opening brace
   */
  it("should error when opening brace is missing", () => {
    const input = `
layout
  Div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected LBRACE/))).toBe(true);
  });

  /**
   * Test: Unexpected token after block
   */
  it("should error on unexpected token after script block", () => {
    const input = `
layout {
  Div {
    "Hello"
  }
}

script {
  onclick: "handler"
}

extra
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Unexpected token/))).toBe(true);
  });

  /**
   * Test: Missing colon in property
   */
  it("should error when colon is missing in meta property", () => {
    const input = `
meta {
  title "Test"
}

layout {
  Div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected COLON/))).toBe(true);
  });

  /**
   * Test: Missing value after colon
   */
  it("should error when value is missing after colon", () => {
    const input = `
meta {
  title:
}

layout {
  Div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected literal value/))).toBe(true);
  });

  /**
   * Test: Component name starts with lowercase
   */
  it("should error when component name starts with lowercase", () => {
    const input = `
layout {
  div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected component or text/))).toBe(true);
  });

  /**
   * Test: Missing closing paren in attributes
   */
  it("should error when closing paren is missing in attributes", () => {
    const input = `
layout {
  Div(class:"test" {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    // Parser detects syntax error (LBRACE when expecting comma or rparen)
    expect(errors.length).toBeGreaterThan(0);
  });

  /**
   * Test: Style value is missing
   */
  it("should error when style value is missing", () => {
    const input = `
style {
  color.primary:
}

layout {
  Div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected literal value/))).toBe(true);
  });

  /**
   * Test: Empty input
   */
  it("should error on completely empty input", () => {
    const input = ``;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(ast).toBeNull();
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain("Layout block is required");
  });

  /**
   * Test: Invalid literal type in context
   */
  it("should error when using invalid token as value", () => {
    const input = `
meta {
  title: {
}

layout {
  Div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected literal value/))).toBe(true);
  });

  /**
   * Test: Component in components block has properties
   */
  it("should error when component in components block has attributes", () => {
    const input = `
components {
  Card(class:"test")
}

layout {
  Card {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    // Components block only accepts TagNames, not attributes
    // The parser should error on LPAREN when expecting RBRACE or TAGNAME
    expect(errors.length).toBeGreaterThan(0);
  });

  /**
   * Test: Script value is not a string
   */
  it("should error when script value is not a string", () => {
    const input = `
layout {
  Div {
    "Hello"
  }
}

script {
  onclick: 123
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    // Parser expects STRING token after colon in script block
    expect(errors.length).toBeGreaterThan(0);
  });

  /**
   * Test: Attribute value is not a string
   */
  it("should error when attribute value is not a string", () => {
    const input = `
layout {
  Div(class:123) {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors.some(e => e.message.match(/Expected STRING/))).toBe(true);
  });

  /**
   * Test: Text node as first child in layout (should use component)
   */
  it("should allow text node as first child but validation will catch it", () => {
    const input = `
layout {
  "Hello World"
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    // Parser should allow this syntactically, but validation layer will reject it
    // Parser v2 should not have errors for this case
    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();
  });
});
