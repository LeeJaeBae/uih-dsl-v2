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
import { generate as generateVue } from "@uih-dsl/codegen-vue";
import { generate as generateSvelte } from "@uih-dsl/codegen-svelte";
// TODO: Temporarily disabled validator until build issues are resolved
// import { validateAST, validateIR } from "@uih-dsl/validator";
import type { ASTRoot } from "@uih-dsl/parser";
import type { UIHIR } from "@uih-dsl/ir";
import type { TargetFramework } from "../utils/target.js";

export interface PipelineResult {
  ast: ASTRoot | null;
  ir: UIHIR | null;
  code: string | null;
  errors: Array<{ message: string; line?: number; column?: number }>;
}

const GENERATORS: Record<TargetFramework, typeof generateReact> = {
  react: generateReact,
  vue: generateVue,
  svelte: generateSvelte,
};

export function runPipeline(
  source: string,
  target: TargetFramework = "react"
): PipelineResult {
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
      result.errors.push(
        ...parseResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        }))
      );
    }

    result.ast = parseResult.ast;

    // Step 3: Validate AST before translation
    // TODO: Re-enable after validator build is fixed
    // const astValidation = validateAST(parseResult.ast);
    // if (astValidation.errors.length > 0) {
    //   result.errors.push(...astValidation.errors);
    // }

    // Step 4: Translate to IR
    const irResult = createIR(parseResult.ast, parseResult.errors);

    if (irResult.errors.length > 0) {
      result.errors.push(
        ...irResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        }))
      );
    }

    result.ir = irResult;

    // Step 5: Validate IR before codegen
    // TODO: Re-enable after validator build is fixed
    // const irValidation = validateIR(irResult);
    // if (irValidation.errors.length > 0) {
    //   result.errors.push(...irValidation.errors);
    // }

    // Step 6: Code generation
    if (result.errors.length === 0) {
      const generator = GENERATORS[target];
      const codeResult = generator(irResult);
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
