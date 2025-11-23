import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "../src/index.js";

describe("String Literal Attribute Tests", () => {
  it("should treat value and checked attributes as strings when they are simple identifiers", () => {
    const input = `
layout {
  Input(type:"checkbox", checked:"isChecked", value:"agreed")
  Option(value:"junior")
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    // "isChecked" is a simple identifier, but 'checked' is in STRING_ONLY_ATTRS now.
    // So checked="isChecked"
    expect(output.code).toContain('checked="isChecked"');
    
    // "junior" is a simple identifier, 'value' is in STRING_ONLY_ATTRS
    expect(output.code).toContain('value="junior"');
    
    // "agreed"
    expect(output.code).toContain('value="agreed"');

    // Should NOT be variables
    expect(output.code).not.toContain('checked={isChecked}');
    expect(output.code).not.toContain('value={junior}');
  });

  it("should still allow expressions with dots", () => {
    const input = `
layout {
  Input(value:"user.name")
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    // Dots mean expression
    expect(output.code).toContain('value={user.name}');
  });
});
