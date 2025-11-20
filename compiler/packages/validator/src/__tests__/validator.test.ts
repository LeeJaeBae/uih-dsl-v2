import { describe, expect, it } from "vitest";
import type { Range } from "@uih-dsl/tokenizer";
import type { ASTRoot } from "@uih-dsl/parser";
import type { UIHIR } from "@uih-dsl/ir";
import { validateAST, validateIR } from "../validator.js";

const location: Range = {
  start: { line: 1, column: 1, index: 0 },
  end: { line: 1, column: 5, index: 4 },
};

describe("validateAST", () => {
  it("flags duplicate meta keys and uppercase attributes", () => {
    const ast: ASTRoot = {
      type: "Program",
      meta: {
        type: "Meta",
        properties: [
          { key: "title", value: "One", location },
          { key: "title", value: "Two", location },
        ],
      },
      style: { type: "Style", properties: [] },
      components: null,
      layout: {
        type: "Layout",
        children: [
          {
            type: "Component",
            tag: "Div",
            attributes: [{ key: "Color", value: "blue", location }],
            children: [{ type: "Text", value: " ", location }],
            location,
          },
        ],
      },
      script: null,
    };

    const result = validateAST(ast);
    expect(result.errors.some((err) => err.message.includes("Duplicate meta key"))).toBe(true);
    expect(result.errors.some((err) => err.message.includes("lowercase"))).toBe(true);
    expect(result.errors.some((err) => err.message.includes("Text node cannot be empty"))).toBe(true);
  });
});

describe("validateIR", () => {
  it("flags invalid script and style tokens", () => {
    const ir: UIHIR = {
      meta: {},
      style: { tokens: [{ path: ["theme"], value: "dark" }] },
      components: [],
      layout: [],
      script: [
        { event: "OnClick", handler: "", },
      ],
      errors: [],
    };

    const result = validateIR(ir);
    expect(result.errors.some((err) => err.message.includes("Layout must contain"))).toBe(true);
    expect(result.errors.some((err) => err.message.includes("Style token 'theme'"))).toBe(true);
    expect(result.errors.some((err) => err.message.includes("camelCase"))).toBe(true);
    expect(result.errors.some((err) => err.message.includes("cannot be empty"))).toBe(true);
  });
});
