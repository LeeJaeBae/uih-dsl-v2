import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "../src/index.js";

describe("Control Flow Codegen Tests", () => {
  it("should generate list rendering (for loop)", () => {
    const input = `
layout {
  Ul {
    Li(for:"item in items", key:"item.id") {
      "Item"
    }
  }
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("{items.map((item, i) => (");
    expect(output.code).toContain("key={item.id}");
    expect(output.code).toContain("<li");
  });

  it("should handle nested if and for", () => {
    const input = `
layout {
  Ul {
    Li(if:"showList", for:"user in users", key:"user.id") {
      Span { "User" }
    }
  }
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    // Expect if wrapper -> map wrapper -> component
    expect(output.code).toContain("{showList && (");
    expect(output.code).toContain("{users.map((user, i) => (");
    expect(output.code).toContain("key={user.id}");
  });

  it("should handle dynamic attributes with dot notation", () => {
    const input = `
layout {
  Div(id:"user.profile.id", title:"page.title")
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("id={user.profile.id}");
    expect(output.code).toContain("title={page.title}");
  });
});
