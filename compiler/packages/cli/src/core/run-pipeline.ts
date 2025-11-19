/**
 * UIH DSL CLI - Compilation Pipeline
 *
 * Orchestrates the full compilation pipeline:
 * Source → Tokenizer → Parser → IR → Codegen
 */

import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate as generateReact } from "@uih-dsl/codegen-react";
import type { ASTRoot } from "@uih-dsl/parser";
import type { UIHIR } from "@uih-dsl/ir";

export interface PipelineResult {
  ast: ASTRoot | null;
  ir: UIHIR | null;
  code: string | null;
  errors: Array<{ message: string; line?: number; column?: number }>;
}

export function runPipeline(source: string, target: "react" | "vue" | "svelte" = "react"): PipelineResult {
  const result: PipelineResult = {
    ast: null,
    ir: null,
    code: null,
    errors: [],
  };

  try {
    // Step 1: Tokenize
    const tokens = tokenize(source);

    // Step 2: Parse
    const parseResult = parse(tokens);

    if (parseResult.errors.length > 0) {
      result.errors.push(...parseResult.errors.map((err) => ({
        message: err.message,
        line: err.line,
        column: err.column,
      })));
      return result;
    }

    result.ast = parseResult.ast;

    // Step 3: Translate to IR
    const irResult = createIR(parseResult.ast, parseResult.errors);

    if (irResult.errors.length > 0) {
      result.errors.push(...irResult.errors.map((err) => ({
        message: err.message,
      })));
    }

    result.ir = irResult;

    // Step 4: Code generation
    if (result.errors.length === 0) {
      const codeResult = generateReact(irResult);
      result.code = codeResult.code;
    }
  } catch (err) {
    const error = err as Error;
    result.errors.push({
      message: error.message,
    });
  }

  return result;
}
