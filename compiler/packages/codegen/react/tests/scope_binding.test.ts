import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "../src/index.js";

describe("Variable Scope and Attribute Binding Tests", () => {
  it("should treat attribute as string literal if variable is NOT defined", () => {
    // 'junior' is NOT defined in script, so value="junior"
    const input = `
layout {
  Option(value:"junior")
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain('value="junior"');
    expect(output.code).not.toContain('value={junior}');
  });

  it("should treat attribute as expression if variable IS defined in script", () => {
    // 'isLoggedIn' IS defined in script, so value={isLoggedIn}
    const input = `
layout {
  Input(value:"isLoggedIn")
}
script {
  isLoggedIn: "true"
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain('value={isLoggedIn}');
    expect(output.code).not.toContain('value="isLoggedIn"');
  });

  it("should treat attribute as expression if variable IS defined in loop", () => {
    // 'user' is loop variable, so value={user.name}
    const input = `
layout {
  Div(for: "user in users") {
    Input(value:"user.name")
  }
}
script {
  users: "[]"
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    // user.name has dots, so it's always an expression anyway.
    // Let's try a simple variable case inside loop.
    // But wait, loop variables are objects usually.
    // Let's test the scoping mechanism itself.
    expect(output.code).toContain('value={user.name}');
  });

  it("should treat attribute as expression if variable IS loop item itself", () => {
    const input = `
layout {
  Ul {
    Li(for: "tag in tags", id: "tag")
  }
}
script {
  tags: "['a', 'b']"
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    // 'tag' is the loop variable.
    // id should be {tag}, not "tag"
    expect(output.code).toContain('id={tag}');
    expect(output.code).not.toContain('id="tag"');
  });
});
