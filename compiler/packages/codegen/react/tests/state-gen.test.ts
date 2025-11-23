import { describe, it, expect } from "vitest";
import { generate } from "../src/generator";
import { createIR } from "@uih-dsl/ir";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import fs from "fs";
import path from "path";

describe("React State Generation", () => {
  it("should generate useState and handlers from state block", () => {
    const uihPath = path.join(__dirname, "state-demo.uih");
    const input = fs.readFileSync(uihPath, "utf-8");

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);
    
    if (parseErrors.length > 0) {
      console.error(parseErrors);
    }
    expect(parseErrors).toHaveLength(0);

    const ir = createIR(ast!, []);
    expect(ir.errors).toHaveLength(0);

    const { code } = generate(ir);

    // Verify state hook
    expect(code).toContain('const [state, setState] = React.useState("idle");');

    // Verify handlers
    expect(code).toContain('const handleCLICK = () => {');
    expect(code).toContain('switch (state) {');
    expect(code).toContain('case "idle":');
    expect(code).toContain('setState("loading");');
    
    expect(code).toContain('const handleSUCCESS = () => {');
    expect(code).toContain('case "loading":');
    expect(code).toContain('setState("success");');
    
    // console.log(code);
  });
});
