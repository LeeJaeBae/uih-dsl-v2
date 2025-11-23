import { describe, it, expect } from "vitest";
import { generate } from "../src/generator";
import { createIR } from "@uih-dsl/ir";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import fs from "fs";
import path from "path";

describe("Adaptive Component Generation", () => {
  it("should parse components with attributes and generate imports", () => {
    const uihPath = path.join(__dirname, "adaptive.uih");
    const input = fs.readFileSync(uihPath, "utf-8");

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);
    expect(parseErrors).toHaveLength(0);

    const ir = createIR(ast!, []);
    expect(ir.errors).toHaveLength(0);

    // Verify IR metadata
    const card = ir.components.find(c => c.name === "Card");
    expect(card).toBeDefined();
    expect(card!.attrs).toEqual(expect.arrayContaining([
      { key: "role", value: "container" },
      { key: "shadow", value: "sm" }
    ]));

    const { code } = generate(ir);

    // Verify imports generated correctly using name
    expect(code).toContain('import { Card } from "@/components/Card";');
    expect(code).toContain('import { Button } from "@/components/Button";');
  });
});
