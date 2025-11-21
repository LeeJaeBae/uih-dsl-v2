import { z } from "zod";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { validateAST, validateIR } from "@uih-dsl/validator";

export const validateTool = {
  name: "validate_uih",
  description: "Validate UIH DSL code for syntax and semantic errors",
  inputSchema: z.object({
    code: z.string().describe("The UIH code to validate"),
  }),
  handler: async ({ code }: { code: string }) => {
    try {
      const tokens = tokenize(code);
      const { ast, errors: parseErrors } = parse(tokens);
      
      if (parseErrors.length > 0) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ valid: false, errors: parseErrors }, null, 2),
            },
          ],
          isError: true,
        };
      }

      if (!ast) {
        return {
          content: [{ type: "text", text: "AST is null" }],
          isError: true
        };
      }
      const { errors: astErrors } = validateAST(ast as any);
      if (astErrors.length > 0) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ valid: false, errors: astErrors }, null, 2),
            },
          ],
          isError: true,
        };
      }

      const ir = createIR(ast, []);
      if (!ir) {
        return {
          content: [{ type: "text", text: "IR is null" }],
          isError: true
        };
      }
      const { errors: irErrors } = validateIR(ir as any);
      
      if (irErrors.length > 0) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ valid: false, errors: irErrors }, null, 2),
            },
          ],
          isError: true,
        };
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ valid: true, message: "Code is valid" }, null, 2),
          },
        ],
      };
    } catch (error: any) {
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ valid: false, errors: [{ message: error.message }] }, null, 2),
          },
        ],
        isError: true,
      };
    }
  },
};
