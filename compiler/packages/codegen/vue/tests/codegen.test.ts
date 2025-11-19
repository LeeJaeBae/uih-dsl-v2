import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "../src/index.js";

describe("Vue Codegen Tests", () => {
  it("should generate basic Vue 3 SFC component", () => {
    const input = `
meta {
  title: "Test Page"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"container") {
    "Hello World"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);
    const ir = createIR(ast, parseErrors);
    const output = generate(ir);

    expect(output.code).toContain("<script setup");
    expect(output.code).toContain("export const routeMeta");
    expect(output.code).toContain('title: "Test Page"');
    expect(output.code).toContain("<template>");
    expect(output.code).toContain("<div");
    expect(output.code).toContain('class="container"');
    expect(output.code).toContain("Hello World");
    expect(output.code).toContain("</template>");

    expect(output.style).toContain("--color-primary: #0E5EF7");
    expect(output.meta).not.toBeNull();
  });

  it("should generate nested Vue components", () => {
    const input = `
layout {
  Container {
    Header {
      H1 {
        "Title"
      }
    }
    Main {
      P {
        "Content"
      }
    }
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("<container>");
    expect(output.code).toContain("<header>");
    expect(output.code).toContain("<h1>");
    expect(output.code).toContain("Title");
    expect(output.code).toContain("<main>");
    expect(output.code).toContain("<p>");
    expect(output.code).toContain("Content");
    expect(output.code).toContain("</p>");
    expect(output.code).toContain("</main>");
    expect(output.code).toContain("</header>");
    expect(output.code).toContain("</container>");
  });

  it("should generate Vue event handlers", () => {
    const input = `
layout {
  Div {
    "Content"
  }
}

script {
  onclick: "handleClick"
  onload: "initPage"
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.events).toHaveLength(2);
    expect(output.code).toContain("const handleClick = () =>");
    expect(output.code).toContain("const initPage = () =>");
    expect(output.code).toContain("// TODO: Implement onclick handler");
    expect(output.code).toContain("// TODO: Implement onload handler");
  });

  it("should handle self-closing Vue tags", () => {
    const input = `
layout {
  Container {
    Hr
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("<hr />");
  });

  it("should include style tag when styles exist", () => {
    const input = `
style {
  color.primary: "#0E5EF7"
  spacing.unit: "8"
}

layout {
  Div {
    "Test"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("<style scoped>");
    expect(output.code).toContain(":root {");
    expect(output.code).toContain("--color-primary: #0E5EF7");
    expect(output.code).toContain("--spacing-unit: 8");
    expect(output.code).toContain("</style>");
  });
});
