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
  .action(codegenCommand);

program
  .command("compile <file>")
  .description("Compile UIH file to target framework")
  .requiredOption("--out <dir>", "Output directory")
  .action(compileCommand);

program
  .command("dev <file>")
  .description("Development mode with file watching")
  .action(devCommand);

program.parse();
