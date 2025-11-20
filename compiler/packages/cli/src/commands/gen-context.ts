/**
 * UIH DSL CLI - Context Generation Command
 *
 * Extracts grammar rules and project context for LLM consumption.
 * Generates token-efficient system prompts for AI code generation.
 *
 * @module @uih-dsl/cli/commands/gen-context
 */

import { writeFileSync } from "node:fs";
import { loadFile } from "../core/load-file.js";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import type { UIHIR, StyleToken } from "@uih-dsl/ir";
import * as logger from "../utils/logger.js";

export function genContextCommand(
  filePath: string,
  options: { out?: string }
): void {
  try {
    const source = loadFile(filePath);
    const tokens = tokenize(source);
    const parseResult = parse(tokens);

    if (parseResult.errors.length > 0) {
      logger.error("Cannot generate context from invalid UIH file:");
      parseResult.errors.forEach((err) => {
        console.error(`  Line ${err.line}:${err.column} - ${err.message}`);
      });
      process.exit(1);
    }

    if (!parseResult.ast) {
      logger.error("Failed to parse UIH file");
      process.exit(1);
    }

    const ir = createIR(parseResult.ast, []);

    if (ir.errors.length > 0) {
      logger.error("IR translation errors:");
      ir.errors.forEach((err) => {
        console.error(`  ${err.message}`);
      });
      process.exit(1);
    }

    const contextMarkdown = generateContextMarkdown(ir);

    if (options.out) {
      writeFileSync(options.out, contextMarkdown, "utf-8");
      logger.success(`Context written to: ${options.out}`);
    } else {
      // Output to stdout for piping
      console.log(contextMarkdown);
    }
  } catch (err) {
    const error = err as Error;
    logger.error(error.message);
    process.exit(1);
  }
}

/**
 * Generate LLM-friendly markdown context from IR.
 */
function generateContextMarkdown(ir: UIHIR): string {
  const sections: string[] = [];

  // Header
  sections.push("# UIH DSL Context for AI Code Generation\n");
  sections.push(
    "This document provides grammar rules and project-specific context for generating valid UIH code.\n"
  );

  // Grammar Rules (hard-coded for token efficiency)
  sections.push("## Grammar Rules\n");
  sections.push(formatGrammarRules());

  // Style Tokens
  if (ir.style.tokens.length > 0) {
    sections.push("\n## Available Style Tokens\n");
    sections.push(formatStyleTokens(ir.style.tokens));
  }

  // Components
  if (ir.components.length > 0) {
    sections.push("\n## Declared Components\n");
    sections.push(formatComponents(ir.components));
  }

  // Meta Information
  if (Object.keys(ir.meta).length > 0) {
    sections.push("\n## Project Metadata\n");
    sections.push(formatMeta(ir.meta));
  }

  return sections.join("\n");
}

/**
 * Format core grammar rules (hard-coded BNF subset).
 */
function formatGrammarRules(): string {
  return `### Block Structure
\`\`\`
Program ::= meta {...} style {...} components {...}? layout {...} script {...}?
\`\`\`

### Syntax Constraints
- **One intent per line** - No semicolons, no inline nesting
- **Double quotes only** - Single quotes forbidden
- **Fixed block order** - meta → style → components? → layout → script?
- **2-space indentation** - Tabs forbidden
- **Lowercase identifiers** - \`color.primary\`, not \`Color.Primary\`
- **Uppercase TagNames** - \`Div\`, \`Header\`, \`Button\`

### Layout Syntax
\`\`\`
TagName(attr1:"value1", attr2:"value2") {
  ChildTag {
    "Text content"
  }
}
\`\`\`

### Style Token Format
\`\`\`
style {
  category.name: "value"
  color.primary: "#0E5EF7"
  spacing.md: "16px"
}
\`\`\``;
}

/**
 * Format style tokens as grouped tables.
 */
function formatStyleTokens(tokens: StyleToken[]): string {
  // Group tokens by category (first path segment)
  const grouped = new Map<string, StyleToken[]>();

  tokens.forEach((token) => {
    const category = token.path[0];
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(token);
  });

  const tables: string[] = [];

  grouped.forEach((categoryTokens, category) => {
    tables.push(`### ${category}`);
    tables.push("| Token | Value |");
    tables.push("|-------|-------|");

    categoryTokens.forEach((token) => {
      const fullPath = token.path.join(".");
      const value = escapeMarkdown(String(token.value));
      tables.push(`| \`${fullPath}\` | \`${value}\` |`);
    });

    tables.push("");
  });

  return tables.join("\n");
}

/**
 * Format component names as list.
 */
function formatComponents(components: string[]): string {
  const items = components
    .sort()
    .map((name) => `- \`${name}\``)
    .join("\n");
  return items;
}

/**
 * Format meta properties as table.
 */
function formatMeta(meta: Record<string, string | number | boolean>): string {
  const lines: string[] = [];
  lines.push("| Key | Value |");
  lines.push("|-----|-------|");

  Object.entries(meta)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([key, value]) => {
      const valueStr = escapeMarkdown(String(value));
      lines.push(`| \`${key}\` | \`${valueStr}\` |`);
    });

  return lines.join("\n");
}

/**
 * Escape markdown special characters in values.
 */
function escapeMarkdown(text: string): string {
  return text
    .replace(/\|/g, "\\|")
    .replace(/`/g, "\\`")
    .replace(/\*/g, "\\*")
    .replace(/_/g, "\\_");
}
