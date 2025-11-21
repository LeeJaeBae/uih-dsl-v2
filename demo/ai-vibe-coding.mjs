#!/usr/bin/env node
/**
 * UIH DSL - AI-Powered "Vibe Coding" Demo
 *
 * Demonstrates the self-healing compilation workflow using Claude API.
 * This script takes invalid UIH code and automatically fixes it using AI.
 *
 * Usage:
 *   export ANTHROPIC_API_KEY=sk-...
 *   node demo/ai-vibe-coding.mjs
 */

import { smartCompile } from "../compiler/packages/cli/src/utils/smart-compile.js";
import Anthropic from "@anthropic-ai/sdk";

// Check for API key
if (!process.env.ANTHROPIC_API_KEY) {
  console.error("❌ Error: ANTHROPIC_API_KEY environment variable not set");
  console.error("\nUsage:");
  console.error("  export ANTHROPIC_API_KEY=sk-...");
  console.error("  node demo/ai-vibe-coding.mjs");
  process.exit(1);
}

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Invalid UIH code with intentional errors
const invalidUIHCode = `meta {
  title "Missing Colon Error"
}

style {
  color.primary: "#0E5EF7"
  spacing.md "16px"
}

layout {
  Div {
    H1 {
      "AI will fix this!"
    }
  }
}`;

console.log("🚀 UIH DSL - AI-Powered Vibe Coding Demo\n");
console.log("📝 Input (with intentional errors):");
console.log("─".repeat(50));
console.log(invalidUIHCode);
console.log("─".repeat(50));
console.log();

async function runDemo() {
  const result = await smartCompile(invalidUIHCode, {
    maxRetries: 3,
    retryCallback: async (errors, attempt) => {
      console.log(`🤖 Retry attempt ${attempt} - Asking Claude to fix errors...`);
      console.log(`   Errors found: ${errors.length}`);
      errors.forEach((err) => {
        console.log(`   - Line ${err.line}: ${err.message}`);
      });

      const systemPrompt = `You are a UIH DSL code generator. UIH is a strict, LLM-friendly UI language.

Grammar Rules:
- Fixed block order: meta { } → style { } → layout { }
- Property format: key: "value" (colon is REQUIRED)
- Double quotes only
- 2-space indentation
- No semicolons

Fix the errors and return ONLY the corrected UIH code, nothing else.`;

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Fix these UIH errors:

Current code:
\`\`\`
${invalidUIHCode}
\`\`\`

Errors:
${errors.map((e) => `- Line ${e.line}: ${e.message}`).join("\n")}

Return only the corrected UIH code.`,
          },
        ],
      });

      const fixedCode = response.content[0].text.trim();
      // Remove markdown code blocks if present
      const cleanedCode = fixedCode
        .replace(/^```[\w]*\n/, "")
        .replace(/\n```$/, "")
        .trim();

      console.log(`   ✅ Claude responded with fix\n`);
      return cleanedCode;
    },
  });

  console.log("\n" + "=".repeat(50));

  if (result.success) {
    console.log(`✅ SUCCESS after ${result.retryCount} retry attempts!\n`);
    console.log("📝 Final corrected code:");
    console.log("─".repeat(50));
    console.log(result.finalSource);
    console.log("─".repeat(50));
    console.log("\n✨ IR generated successfully:");
    console.log(`   - ${result.ir.layout.length} layout node(s)`);
    console.log(`   - ${result.ir.style.tokens.length} style token(s)`);
    console.log(`   - ${Object.keys(result.ir.meta).length} meta propertie(s)`);
  } else {
    console.log(`❌ FAILED after ${result.retryCount} attempts\n`);
    console.log("Final errors:");
    result.errors.forEach((err) => {
      console.log(`- ${err.message}`);
    });
  }

  console.log("\n" + "=".repeat(50));
  console.log("🎉 Demo completed!");
}

runDemo().catch((error) => {
  console.error("\n❌ Demo failed:", error.message);
  process.exit(1);
});
