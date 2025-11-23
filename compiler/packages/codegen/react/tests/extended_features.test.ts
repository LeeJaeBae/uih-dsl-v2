import { describe, it, expect } from "vitest";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate } from "../src/index.js";

describe("Extended Features Codegen Tests", () => {
  it("should generate semantic HTML5 tags", () => {
    const input = `
layout {
  Section {
    Dialog {
      "Dialog Content"
    }
    Figure {
      Figcaption { "Caption" }
    }
    Details {
      Summary { "Summary" }
    }
    Address { "Address" }
    Time { "2025-01-01" }
    Mark { "Marked" }
  }
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("<section>");
    expect(output.code).toContain("<dialog>");
    expect(output.code).toContain("<figure>");
    expect(output.code).toContain("<figcaption>");
    expect(output.code).toContain("<details>");
    expect(output.code).toContain("<summary>");
    expect(output.code).toContain("<address>");
    expect(output.code).toContain("<time>");
    expect(output.code).toContain("<mark>");
  });

  it("should generate form tags and handle for attribute", () => {
    const input = `
layout {
  Form {
    Fieldset {
      Legend { "User Info" }
      Label(for:"username") { "Name" }
      Input(id:"username")
      Datalist(id:"suggestions") {
        Option(value:"A")
      }
      Meter(value:"0.5")
      Progress(value:"70")
    }
  }
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("<form>");
    expect(output.code).toContain("<fieldset>");
    expect(output.code).toContain("<legend>");
    expect(output.code).toContain('htmlFor="username"');
    expect(output.code).toContain("<datalist");
    expect(output.code).toContain("<meter");
    expect(output.code).toContain("<progress");
  });

  it("should handle boolean attributes correctly", () => {
    const input = `
layout {
  Input(type:"checkbox", checked:"true", disabled:"true")
  Option(selected:"true")
  Video(controls:"true", loop:"true", muted:"true")
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    // React allows shorthand boolean attributes
    expect(output.code).toContain("<input");
    expect(output.code).toContain(" checked"); // check for space+attr to ensure it's not part of value
    expect(output.code).toContain(" disabled");
    expect(output.code).not.toContain('checked="true"');
    expect(output.code).not.toContain('disabled="true"');
    
    expect(output.code).toContain("<option");
    expect(output.code).toContain(" selected");
    
    expect(output.code).toContain("<video");
    expect(output.code).toContain(" controls");
    expect(output.code).toContain(" loop");
    expect(output.code).toContain(" muted");
  });

  it("should handle interactive tags", () => {
    const input = `
layout {
  Iframe(src:"example.com")
  Canvas(width:"100", height:"100")
}
`;
    const tokens = tokenize(input);
    const { ast, errors } = parse(tokens);
    const ir = createIR(ast, errors);
    const output = generate(ir);

    expect(output.code).toContain("<iframe");
    expect(output.code).toContain("<canvas");
  });
});
