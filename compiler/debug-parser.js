import { tokenize } from "./packages/tokenizer/dist/index.js";
import { parse } from "./packages/parser/dist/index.js";

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

console.log("=== INPUT ===");
console.log(input);
console.log("\n=== TOKENIZING ===");

try {
  const tokens = tokenize(input);
  console.log("Tokens count:", tokens.length);
  console.log("First 10 tokens:", tokens.slice(0, 10).map(t => ({ type: t.type, value: t.value })));

  console.log("\n=== PARSING ===");
  const result = parse(tokens);

  if (result.errors.length > 0) {
    console.log("ERRORS:");
    result.errors.forEach(err => console.log(`  - ${err.message}`));
  }

  if (result.ast) {
    console.log("\nAST:");
    console.log(JSON.stringify(result.ast, null, 2));
  } else {
    console.log("\nAST is null");
  }
} catch (error) {
  console.error("EXCEPTION:", error.message);
  console.error(error.stack);
}
