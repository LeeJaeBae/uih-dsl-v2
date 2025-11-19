/**
 * Simple test script for Parser v1
 *
 * Run with: node test-parser.js
 */

import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";

const testInput = `
layout {
  Div(class:"container") {
    "Hello World"
  }
}
`;

console.log("=== UIH DSL Parser Test ===\n");

try {
  // Tokenize
  console.log("1. Tokenizing...");
  const tokens = tokenize(testInput);
  console.log(`   ✓ Generated ${tokens.length} tokens\n`);

  // Parse
  console.log("2. Parsing...");
  const ast = parse(tokens);
  console.log("   ✓ AST generated successfully\n");

  // Display AST
  console.log("3. AST Output:");
  console.log(JSON.stringify(ast, null, 2));

  console.log("\n✨ Test passed!");
} catch (error) {
  console.error("\n❌ Test failed:");
  console.error(error);
  process.exit(1);
}
