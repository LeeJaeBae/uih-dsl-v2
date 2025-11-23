import { describe, it, expect } from "vitest";
import { generate } from "../src/generator";
import { createIR } from "@uih-dsl/ir";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import fs from "fs";
import path from "path";

describe("Vue State Generation", () => {
  it("should generate ref and handlers from state block", () => {
    const uihPath = path.join(__dirname, "state-demo.uih");
    const input = fs.readFileSync(uihPath, "utf-8");

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);
    expect(parseErrors).toHaveLength(0);

    const ir = createIR(ast!, []);
    expect(ir.errors).toHaveLength(0);

    const { code } = generate(ir);

    // Verify imports
    expect(code).toContain("import { ref } from 'vue';");

    // Verify state ref
    expect(code).toContain('const state = ref("idle");');

    // Verify handlers
    expect(code).toContain('const handleCLICK = () => {');
    expect(code).toContain('switch (state.value) {');
    expect(code).toContain('case "idle":');
    expect(code).toContain('state.value = "loading";');
    
    expect(code).toContain('const handleSUCCESS = () => {');
    expect(code).toContain('case "loading":');
    expect(code).toContain('state.value = "success";');

    // Verify template bindings
    expect(code).toContain('<button @click="handleCLICK">');
    expect(code).toContain('<button @click="handleSUCCESS">');
  });
});
