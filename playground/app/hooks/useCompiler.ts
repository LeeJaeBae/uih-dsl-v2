import { useMemo } from "react";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate as generateReact } from "@uih-dsl/codegen-react";
import { generate as generateVue } from "@uih-dsl/codegen-vue";
import { generate as generateSvelte } from "@uih-dsl/codegen-svelte";
import type { CompileResult, Framework } from "../types";

export function useCompiler(dsl: string, framework: Framework): CompileResult {
  return useMemo(() => {
    const result: CompileResult = {
      ast: null,
      ir: null,
      code: "",
      errors: [],
    };

    try {
      const tokens = tokenize(dsl);
      const parseResult = parse(tokens);

      if (parseResult.errors.length > 0) {
        result.errors = parseResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        }));
        return result;
      }

      if (!parseResult.ast) {
        result.errors = [{ message: "Failed to parse UIH code", line: 1, column: 1 }];
        return result;
      }

      result.ast = parseResult.ast;

      const irResult = createIR(parseResult.ast, parseResult.errors);

      if (irResult.errors.length > 0) {
        result.errors = irResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        }));
        return result;
      }

      result.ir = irResult;

      let codeResult;
      switch (framework) {
        case "react":
          codeResult = generateReact(irResult);
          break;
        case "vue":
          codeResult = generateVue(irResult);
          break;
        case "svelte":
          codeResult = generateSvelte(irResult);
          break;
      }

      result.code = codeResult.code;
    } catch (error: any) {
      result.errors = [{ message: `Compilation failed: ${error.message}`, line: 1, column: 1 }];
    }

    return result;
  }, [dsl, framework]);
}
