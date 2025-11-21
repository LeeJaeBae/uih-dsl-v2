import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "../src/index.js";

describe("Codegen Tests", () => {
  it("should generate basic React component", () => {
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

    expect(output.code).toContain("export const metadata");
    expect(output.code).toContain('title: "Test Page"');
    expect(output.code).toContain("export default function Page()");
    expect(output.code).toContain("<div");
    expect(output.code).toContain('className="container"');
    expect(output.code).toContain('{"Hello World"}');

    expect(output.style).toContain("--color-primary: #0E5EF7");
    expect(output.meta).not.toBeNull();
  });

  it("should generate nested components", () => {
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

    expect(output.code).toContain("<Container>");
    expect(output.code).toContain("<header>");
    expect(output.code).toContain("<h1>");
    expect(output.code).toContain('{"Title"}');
    expect(output.code).toContain("<main>");
    expect(output.code).toContain("<p>");
    expect(output.code).toContain('{"Content"}');
    expect(output.code).toContain("</p>");
    expect(output.code).toContain("</main>");
    expect(output.code).toContain("</header>");
    expect(output.code).toContain("</Container>");
  });

  it("should generate script event handlers", () => {
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
    expect(output.code).toContain("function handleClick()");
    expect(output.code).toContain("function initPage()");
    expect(output.code).toContain("// TODO: Implement onclick handler");
    expect(output.code).toContain("// TODO: Implement onload handler");
  });

  it("should handle multiple attributes", () => {
    const input = `
layout {
  Div(class:"container", id:"main", role:"main") {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain('className="container"');
    expect(output.code).toContain('id="main"');
    expect(output.code).toContain('role="main"');
  });

  it("should include error comments when errors exist", () => {
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
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("/* UIH WARNINGS:");
    expect(output.code).toContain("must use dot notation");
  });

  it("should handle empty optional blocks", () => {
    const input = `
layout {
  Div {
    "Minimal"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.meta).toBeNull();
    expect(output.style).toBeNull();
    expect(output.events).toHaveLength(0);
    expect(output.code).toContain("export default function Page()");
    expect(output.code).toContain("<div>");
    expect(output.code).toContain('{"Minimal"}');
  });

  it("should handle self-closing components", () => {
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
});
