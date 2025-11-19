import { tokenize } from "./packages/tokenizer/dist/index.js";
import { parse } from "./packages/parser/dist/index.js";
import { createIR } from "./packages/ir/dist/index.js";
import { generate as generateReact } from "./packages/codegen/react/dist/index.js";

const input = `meta {
  title: "Test"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
}

layout {
  Div(class:"p-4") {
    H1(class:"text-2xl") {
      "Hello"
    }
  }
}`;

console.log("=== STEP 1: TOKENIZE ===");
const tokens = tokenize(input);
console.log("✅ Tokens:", tokens.length);

console.log("\n=== STEP 2: PARSE ===");
const parseResult = parse(tokens);
console.log("Parse errors:", parseResult.errors.length);
console.log("AST:", parseResult.ast ? "✅ Generated" : "❌ Null");

if (parseResult.errors.length > 0) {
  console.log("Errors:");
  parseResult.errors.forEach(err => {
    console.log(`  - ${err.message} at ${err.line}:${err.column}`);
  });
}

if (!parseResult.ast) {
  console.log("No AST, stopping");
  process.exit(1);
}

console.log("\n=== STEP 3: CREATE IR ===");
let irResult;
try {
  irResult = createIR(parseResult.ast, parseResult.errors);
  console.log("IR errors:", irResult.errors.length);
  console.log("IR meta:", Object.keys(irResult.meta).length > 0 ? "✅ Generated" : "❌ Empty");
  console.log("IR layout:", irResult.layout && irResult.layout.length > 0 ? "✅ Generated" : "❌ Empty");
  console.log("IR style tokens:", irResult.style.tokens.length);

  if (irResult.errors.length > 0) {
    console.log("IR Errors:");
    irResult.errors.forEach(err => {
      console.log(`  - ${err.message}`);
    });
    process.exit(1);
  }
} catch (error) {
  console.error("❌ EXCEPTION in createIR:");
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}

console.log("\n=== STEP 4: CODE GENERATION (React) ===");
try {
  const codeResult = generateReact(irResult);
  console.log("Code generation:", codeResult.code ? "✅ Success" : "❌ Failed");
  console.log("Generated code length:", codeResult.code.length, "characters");
  console.log("\nGenerated Code:");
  console.log("─".repeat(80));
  console.log(codeResult.code);
  console.log("─".repeat(80));
} catch (error) {
  console.error("❌ EXCEPTION in generateReact:");
  console.error(error.message);
  console.error(error.stack);
  process.exit(1);
}
