#!/usr/bin/env node
/**
 * UIH DSL CLI - Entry Point
 *
 * @module @uih-dsl/cli
 */

import { program } from "commander";
import { astCommand } from "./commands/ast.js";
import { irCommand } from "./commands/ir.js";
import { codegenCommand } from "./commands/codegen.js";
import { compileCommand } from "./commands/compile.js";
import { devCommand } from "./commands/dev.js";
import { genContextCommand } from "./commands/gen-context.js";

program
  .name("uih")
  .description("UIH DSL Command Line Interface")
  .version("1.0.0");

program
  .command("ast <file>")
  .description("Display Abstract Syntax Tree")
  .action(astCommand);

program
  .command("ir <file>")
  .description("Display Intermediate Representation")
  .action(irCommand);

program
  .command("codegen <file>")
  .description("Generate code for target framework")
  .requiredOption("--out <dir>", "Output directory")
  .option("-t, --target <target>", "Target framework (react|vue|svelte)", "react")
  .action(codegenCommand);

program
  .command("compile <file>")
  .description("Compile UIH file to target framework")
  .requiredOption("--out <dir>", "Output directory")
  .option("-t, --target <target>", "Target framework (react|vue|svelte)", "react")
  .action(compileCommand);

program
  .command("dev <file>")
  .description("Development mode with WebSocket server")
  .option("-t, --target <target>", "Target framework (react|vue|svelte)", "react")
  .option("-p, --port <port>", "WebSocket port (default: 3001)", "3001")
  .action(devCommand);

program
  .command("gen-context <file>")
  .description("Generate LLM context from UIH file")
  .option("--out <file>", "Output file (default: stdout)")
  .action(genContextCommand);

program.parse();

