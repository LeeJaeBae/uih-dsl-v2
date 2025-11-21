import { z } from "zod";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate as generateReact } from "@uih-dsl/codegen-react";
import { generate as generateVue } from "@uih-dsl/codegen-vue";
import { generate as generateSvelte } from "@uih-dsl/codegen-svelte";

export const compileTool = {
  name: "compile_uih",
  description: "Compile UIH DSL code to React, Vue, or Svelte",
  inputSchema: z.object({
    code: z.string().describe("The UIH code to compile"),
    target: z.enum(["react", "vue", "svelte"]).describe("Target framework"),
  }),
  handler: async ({ code, target }: { code: string; target: "react" | "vue" | "svelte" }) => {
    try {
      const tokens = tokenize(code);
      const { ast, errors: parseErrors } = parse(tokens);
      
      if (parseErrors.length > 0) {
        return {
          isError: true,
          content: [
            {
              type: "text",
              text: `Parse Errors:\n${parseErrors.map(e => `- ${e.message} (line ${e.line})`).join("\n")}`,
            },
          ],
        };
      }

      const ir = createIR(ast as any, []);
      
      let output;
      switch (target) {
        case "react":
          output = generateReact(ir);
          break;
        case "vue":
          output = generateVue(ir);
          break;
        case "svelte":
          output = generateSvelte(ir);
          break;
      }

      return {
        content: [
          {
            type: "text",
            text: output.code,
          },
        ],
        isError: false,
      };
    } catch (error: any) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Compilation Failed: ${error.message}`,
          },
        ],
      };
    }
  },
};
