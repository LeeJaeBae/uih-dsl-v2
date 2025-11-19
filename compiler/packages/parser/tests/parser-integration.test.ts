/**
 * UIH DSL Parser v1 - Integration Test Suite
 *
 * Tests complete Tokenizer → Parser → Validation pipeline.
 * Verifies AST structure and semantic validation rules.
 *
 * @module tests/parser-integration
 */

import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "../src/parser.js";
import { validateAST, hasErrors } from "../src/validation/index.js";

describe("Parser Integration Tests", () => {
  /**
   * Test: Basic layout parsing
   */
  it("should parse minimal valid layout block", () => {
    const input = `
layout {
  Div {
    "Hello"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();
    expect(ast!.type).toBe("Program");
    expect(ast!.layout.type).toBe("Layout");
    expect(ast!.layout.children).toHaveLength(1);
    expect(ast!.layout.children[0].type).toBe("Component");
  });

  /**
   * Test: Meta block parsing
   */
  it("should parse meta block with properties", () => {
    const input = `
meta {
  title: "Home Page"
  route: "/"
}

layout {
  Div {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();
    expect(ast!.meta.type).toBe("Meta");
    expect(ast!.meta.properties).toHaveLength(2);
    expect(ast!.meta.properties[0].key).toBe("title");
    expect(ast!.meta.properties[0].value).toBe("Home Page");
    expect(ast!.meta.properties[1].key).toBe("route");
    expect(ast!.meta.properties[1].value).toBe("/");
  });

  /**
   * Test: Style block parsing
   */
  it("should parse style block with dot notation", () => {
    const input = `
style {
  color.primary: "#0E5EF7"
  font.size: 16
}

layout {
  Div {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();
    expect(ast!.style.type).toBe("Style");
    expect(ast!.style.properties).toHaveLength(2);
    expect(ast!.style.properties[0].key).toBe("color.primary");
    expect(ast!.style.properties[0].value).toBe("#0E5EF7");
    expect(ast!.style.properties[1].key).toBe("font.size");
    expect(ast!.style.properties[1].value).toBe(16);
  });

  /**
   * Test: Components block parsing
   */
  it("should parse components block", () => {
    const input = `
components {
  Card
  Button
}

layout {
  Card {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();
    expect(ast!.components).not.toBeNull();
    expect(ast!.components?.type).toBe("Components");
    expect(ast!.components?.components).toHaveLength(2);
    expect(ast!.components?.components[0].name).toBe("Card");
    expect(ast!.components?.components[1].name).toBe("Button");
  });

  /**
   * Test: Script block parsing (all lowercase - tokenizer limitation)
   */
  it("should parse script block with event handlers", () => {
    const input = `
layout {
  Div {
    "Content"
  }
}

script {
  onclick: "handleClick"
  onload: "initialize"
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();
    expect(ast!.script).not.toBeNull();
    expect(ast!.script?.type).toBe("Script");
    expect(ast!.script?.events).toHaveLength(2);
    expect(ast!.script?.events[0].key).toBe("onclick");
    expect(ast!.script?.events[0].value).toBe("handleClick");
    expect(ast!.script?.events[1].key).toBe("onload");
    expect(ast!.script?.events[1].value).toBe("initialize");
  });

  /**
   * Test: Nested components
   */
  it("should parse deeply nested component tree", () => {
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

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const container = ast!.layout.children[0];
    expect(container.type).toBe("Component");

    if (container.type === "Component") {
      expect(container.tag).toBe("Container");
      expect(container.children).toHaveLength(2);

      const header = container.children[0];
      expect(header.type).toBe("Component");

      if (header.type === "Component") {
        expect(header.tag).toBe("Header");
        expect(header.children).toHaveLength(1);
      }
    }
  });

  /**
   * Test: Component with multiple attributes
   */
  it("should parse component with multiple attributes", () => {
    const input = `
layout {
  Div(class:"container", id:"main", role:"main") {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const div = ast!.layout.children[0];
    expect(div.type).toBe("Component");

    if (div.type === "Component") {
      expect(div.attributes).toHaveLength(3);
      expect(div.attributes[0].key).toBe("class");
      expect(div.attributes[0].value).toBe("container");
      expect(div.attributes[1].key).toBe("id");
      expect(div.attributes[1].value).toBe("main");
      expect(div.attributes[2].key).toBe("role");
      expect(div.attributes[2].value).toBe("main");
    }
  });

  /**
   * Test: Text node parsing
   */
  it("should parse text nodes correctly", () => {
    const input = `
layout {
  P {
    "Hello World"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    expect(errors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const p = ast!.layout.children[0];
    if (p.type === "Component") {
      const text = p.children[0];
      expect(text.type).toBe("Text");
      if (text.type === "Text") {
        expect(text.value).toBe("Hello World");
      }
    }
  });

  /**
   * Test: Validation - meta.title type
   */
  it("should validate that meta.title must be a string", () => {
    const input = `
meta {
  title: 123
}

layout {
  Div {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(parseErrors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const validationErrors = validateAST(ast!);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].rule).toBe("meta.title.type");
    expect(validationErrors[0].severity).toBe("error");
    expect(validationErrors[0].message).toContain("must be a string");
  });

  /**
   * Test: Validation - style key format
   */
  it("should validate that style keys use dot notation", () => {
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

    expect(parseErrors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const validationErrors = validateAST(ast!);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].rule).toBe("style.key.format");
    expect(validationErrors[0].severity).toBe("error");
    expect(validationErrors[0].message).toContain("must use dot notation");
  });

  /**
   * Test: Parser rejects style value boolean (not validation layer)
   */
  it("should reject style values that are boolean at parse time", () => {
    const input = `
style {
  font.bold: true
}

layout {
  Div {
    "Content"
  }
}
`;

    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);

    // Parser v2 collects errors instead of throwing
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toContain("Style values cannot be boolean");
  });

  /**
   * Test: Validation - layout must start with component
   */
  it("should validate that layout must start with component", () => {
    const input = `
layout {
  "Hello World"
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(parseErrors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const validationErrors = validateAST(ast!);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].rule).toBe("layout.root.type");
    expect(validationErrors[0].severity).toBe("error");
    expect(validationErrors[0].message).toContain("must start with a component");
  });

  /**
   * Test: Validation - script key format (tokenizer limits to lowercase+digits+dots)
   */
  it("should pass validation for valid lowercase script keys", () => {
    const input = `
layout {
  Div {
    "Content"
  }
}

script {
  onclick: "handler"
  onload: "init"
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(parseErrors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const validationErrors = validateAST(ast!);

    // All lowercase keys should pass camelCase validation
    // (tokenizer doesn't support actual camelCase, so we test what works)
    expect(hasErrors(validationErrors)).toBe(false);
  });

  /**
   * Test: Validation - script value cannot be empty
   */
  it("should validate that script values cannot be empty", () => {
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

    expect(parseErrors).toHaveLength(0);
    expect(ast).not.toBeNull();

    const validationErrors = validateAST(ast!);

    expect(validationErrors.length).toBeGreaterThan(0);
    expect(validationErrors[0].rule).toBe("script.value.empty");
    expect(validationErrors[0].severity).toBe("error");
    expect(validationErrors[0].message).toContain("cannot be empty");
  });

  /**
   * Test: Full integration with all blocks
   */
  it("should parse and validate complete UIH DSL file", () => {
    const input = `
meta {
  title: "Complete Example"
  route: "/example"
}

style {
  color.primary: "#0E5EF7"
  font.family: "Inter"
}

components {
  Card
  Button
}

layout {
  Container(class:"app") {
    Header {
      H1 {
        "UIH DSL"
      }
    }
    Main {
      Card(class:"welcome") {
        P {
          "Welcome to UIH DSL"
        }
        Button(class:"cta") {
          "Get Started"
        }
      }
    }
  }
}

script {
  onload: "initializeApp"
  onclick: "handleButtonClick"
}
`;

    const tokens = tokenize(input);
    const { ast, errors: parseErrors } = parse(tokens);

    expect(parseErrors).toHaveLength(0);
    expect(ast).not.toBeNull();

    // Verify structure
    expect(ast!.type).toBe("Program");
    expect(ast!.meta.properties).toHaveLength(2);
    expect(ast!.style.properties).toHaveLength(2);
    expect(ast!.components?.components).toHaveLength(2);
    expect(ast!.layout.children).toHaveLength(1);
    expect(ast!.script?.events).toHaveLength(2);

    // Validate (should pass all rules)
    const validationErrors = validateAST(ast!);
    expect(hasErrors(validationErrors)).toBe(false);
  });
});
