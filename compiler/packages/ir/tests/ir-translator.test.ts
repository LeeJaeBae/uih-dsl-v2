/**
 * UIH DSL IR Translator - Test Suite
 *
 * Tests AST-to-IR translation process.
 * Verifies deterministic output and error collection.
 *
 * @module tests/ir-translator
 */

import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "../src/index.js";

describe("IR Translator Tests", () => {
  /**
   * Test: Basic IR generation
   */
  it("should generate IR from valid AST", () => {
    const input = `
meta {
  title: "Test Page"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  font.size: 16
}

components {
  Button
  Card
}

layout {
  Container(class:"main") {
    H1 {
      "Hello World"
    }
    Button(id:"btn") {
      "Click Me"
    }
  }
}

script {
  onclick: "handleClick"
  onload: "init"
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).not.toBeNull();
    expect(parseErrors).toHaveLength(0);

    const ir = createIR(ast, parseErrors);

    // Verify meta
    expect(ir.meta).toEqual({
      route: "/",
      title: "Test Page",
    });

    // Verify style tokens
    expect(ir.style.tokens).toHaveLength(2);
    expect(ir.style.tokens[0]).toEqual({
      path: ["color", "primary"],
      value: "#0E5EF7",
    });
    expect(ir.style.tokens[1]).toEqual({
      path: ["font", "size"],
      value: 16,
    });

    // Verify components (sorted alphabetically)
    expect(ir.components).toEqual(["Button", "Card"]);

    // Verify layout
    expect(ir.layout).toHaveLength(1);
    const container = ir.layout[0];
    expect(container.type).toBe("Component");
    if (container.type === "Component") {
      expect(container.tag).toBe("Container");
      expect(container.attrs).toEqual([{ key: "class", value: "main" }]);
      expect(container.children).toHaveLength(2);

      const h1 = container.children[0];
      expect(h1.type).toBe("Component");
      if (h1.type === "Component") {
        expect(h1.tag).toBe("H1");
        expect(h1.children).toHaveLength(1);
        expect(h1.children[0]).toEqual({
          type: "Text",
          value: "Hello World",
        });
      }
    }

    // Verify script (sorted by event name)
    expect(ir.script).toHaveLength(2);
    expect(ir.script[0]).toEqual({
      event: "onclick",
      handler: "handleClick",
    });
    expect(ir.script[1]).toEqual({
      event: "onload",
      handler: "init",
    });

    // Verify no errors
    expect(ir.errors).toHaveLength(0);
  });

  /**
   * Test: IR with parser errors
   */
  it("should include parser errors in IR", () => {
    const input = `
meta {
  title: "Test"
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).toBeNull();
    expect(parseErrors.length).toBeGreaterThan(0);

    const ir = createIR(ast, parseErrors);

    expect(ir.errors.length).toBeGreaterThan(0);
    expect(ir.errors[0].message).toContain("Layout block is required");
  });

  /**
   * Test: IR with style validation errors
   */
  it("should collect style validation errors", () => {
    const input = `
style {
  primary: "#000"
}

layout {
  Div {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).not.toBeNull();
    expect(parseErrors).toHaveLength(0);

    const ir = createIR(ast, parseErrors);

    // IR should have translation error for invalid style key
    expect(ir.errors.length).toBeGreaterThan(0);
    expect(ir.errors[0].message).toContain("must use dot notation");

    // Style tokens should be empty (invalid token rejected)
    expect(ir.style.tokens).toHaveLength(0);
  });

  /**
   * Test: IR with script validation errors
   */
  it("should collect script validation errors", () => {
    const input = `
layout {
  Div {
    "Content"
  }
}

script {
  onclick: ""
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).not.toBeNull();
    expect(parseErrors).toHaveLength(0);

    const ir = createIR(ast, parseErrors);

    // IR should have translation error for empty handler
    expect(ir.errors.length).toBeGreaterThan(0);
    expect(ir.errors[0].message).toContain("cannot be empty");

    // Script entries should be empty (invalid entry rejected)
    expect(ir.script).toHaveLength(0);
  });

  /**
   * Test: Deterministic output (alphabetical sorting)
   */
  it("should produce deterministic sorted output", () => {
    const input = `
meta {
  zebra: "last"
  apple: "first"
  middle: "middle"
}

style {
  z.value: 1
  a.value: 2
  m.value: 3
}

components {
  Zebra
  Apple
  Middle
}

layout {
  Div {
    "Content"
  }
}

script {
  onzebra: "z"
  onapple: "a"
  onmiddle: "m"
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).not.toBeNull();

    const ir = createIR(ast, parseErrors);

    // Meta keys should be sorted
    const metaKeys = Object.keys(ir.meta);
    expect(metaKeys).toEqual(["apple", "middle", "zebra"]);

    // Style tokens should be sorted by path
    expect(ir.style.tokens[0].path).toEqual(["a", "value"]);
    expect(ir.style.tokens[1].path).toEqual(["m", "value"]);
    expect(ir.style.tokens[2].path).toEqual(["z", "value"]);

    // Components should be sorted
    expect(ir.components).toEqual(["Apple", "Middle", "Zebra"]);

    // Script entries should be sorted by event name
    expect(ir.script[0].event).toBe("onapple");
    expect(ir.script[1].event).toBe("onmiddle");
    expect(ir.script[2].event).toBe("onzebra");
  });

  /**
   * Test: Attribute sorting (deterministic)
   */
  it("should sort component attributes alphabetically", () => {
    const input = `
layout {
  Div(zebra:"z", apple:"a", middle:"m") {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).not.toBeNull();

    const ir = createIR(ast, parseErrors);

    const div = ir.layout[0];
    expect(div.type).toBe("Component");
    if (div.type === "Component") {
      expect(div.attrs).toEqual([
        { key: "apple", value: "a" },
        { key: "middle", value: "m" },
        { key: "zebra", value: "z" },
      ]);
    }
  });

  /**
   * Test: Empty optional blocks
   */
  it("should handle missing optional blocks", () => {
    const input = `
layout {
  Div {
    "Minimal"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(ast).not.toBeNull();

    const ir = createIR(ast, parseErrors);

    // Meta should have default empty properties
    expect(ir.meta).toEqual({});

    // Style should have empty tokens
    expect(ir.style.tokens).toHaveLength(0);

    // Components should be empty
    expect(ir.components).toHaveLength(0);

    // Script should be empty
    expect(ir.script).toHaveLength(0);

    // Layout should exist
    expect(ir.layout).toHaveLength(1);

    // No errors
    expect(ir.errors).toHaveLength(0);
  });
});
