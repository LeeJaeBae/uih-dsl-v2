/**
 * UIH VSCode Extension v2
 * Updated for UIH DSL v2 specification with Self-Healing AI
 */

import * as vscode from "vscode";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate as generateReact } from "@uih-dsl/codegen-react";
import { generate as generateVue } from "@uih-dsl/codegen-vue";
import { generate as generateSvelte } from "@uih-dsl/codegen-svelte";
import { smartCompile } from "../../../compiler/packages/cli/dist/index.js";
import Anthropic from "@anthropic-ai/sdk";
import type { ASTRoot } from "@uih-dsl/parser";
import type { UIHIR } from "@uih-dsl/ir";

let statusBar Item: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {
  console.log('UIH v2 extension activated with Self-Healing');

  // Create status bar item for feedback
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  context.subscriptions.push(statusBarItem);

  // Register preview command
  const previewCommand = vscode.commands.registerCommand(
    "uih.preview",
    async () => {
      await handlePreview(context);
    }
  );

  // Register compile command
  const compileCommand = vscode.commands.registerCommand(
    "uih.compile",
    async () => {
      await handleCompile();
    }
  );

  // Register onWillSave listener for auto-fix
  const saveListener = vscode.workspace.onWillSaveTextDocument(async (e) => {
    if (e.document.languageId !== "uih") return;

    const config = vscode.workspace.getConfiguration("uih");
    const autoFixEnabled = config.get<boolean>("autoFixOnSave", false);

    if (!autoFixEnabled) return;

    e.waitUntil(attemptAutoFix(e.document));
  });

  context.subscriptions.push(previewCommand, compileCommand, saveListener);

  // Auto-preview if enabled
  const config = vscode.workspace.getConfiguration("uih");
  if (config.get("autoPreview")) {
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && editor.document.languageId === "uih") {
        handlePreview(context);
      }
    });
  }
}

// ... (keep all existing functions: handlePreview, handleCompile, getPreviewHtml, etc.)

/**
 * Attempt to auto-fix UIH syntax errors using AI
 */
async function attemptAutoFix(
  document: vscode.TextDocument
): Promise<vscode.TextEdit[]> {
  const source = document.getText();

  // Quick validation: check for errors
  try {
    const tokens = tokenize(source);
    const parseResult = parse(tokens);

    if (parseResult.errors.length === 0) {
      // No errors, skip auto-fix
      return [];
    }
  } catch {
    // Tokenizer threw, let user see the error naturally
    return [];
  }

  // Get API key from configuration
  const config = vscode.workspace.getConfiguration("uih");
  const apiKey = config.get<string>("anthropicApiKey");

  if (!apiKey || apiKey.trim() === "") {
    // No API key configured, skip silently
    return [];
  }

  try {
    const result = await smartCompile(source, {
      maxRetries: 1, // Only 1 retry for save performance
      retryCallback: async (errors) => {
        const client = new Anthropic({ apiKey });

        const systemPrompt = `You are a UIH DSL code generator. UIH is a strict, LLM-friendly UI language.

Grammar Rules:
- Fixed block order: meta {...} → style {...} → components {...}? → layout {...} → script {...}?
- Property format: key: "value" (colon is REQUIRED)
- Double quotes only (single quotes forbidden)
- 2-space indentation (tabs forbidden)
- No semicolons
- Lowercase identifiers, Uppercase TagNames

Fix ONLY the syntax errors. Do not change the logic or structure unless necessary for syntax correctness.
Return ONLY the corrected UIH code, nothing else.`;

        const response = await client.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 2048,
          system: systemPrompt,
          messages: [
            {
              role: "user",
              content: `Fix these UIH syntax errors:

Errors:
${errors.map((e) => `- Line ${e.line}: ${e.message}`).join("\n")}

Current code:
\`\`\`uih
${source}
\`\`\`

Return only the corrected UIH code.`,
            },
          ],
        });

        let fixedCode = response.content[0].text.trim();

        // Remove markdown code blocks if present
        fixedCode = fixedCode
          .replace(/^```[\w]*\n/, "")
          .replace(/\n```$/, "")
          .trim();

        return fixedCode;
      },
    });

    if (result.success && result.finalSource !== source) {
      // Show success feedback
      statusBarItem.text = "$(check) UIH Auto-fixed";
      statusBarItem.show();
      setTimeout(() => statusBarItem.hide(), 3000);

      // Return TextEdit to replace entire document
      const fullRange = new vscode.Range(
        document.positionAt(0),
        document.positionAt(source.length)
      );

      return [vscode.TextEdit.replace(fullRange, result.finalSource)];
    }
  } catch (error) {
    // Silent fail - don't interrupt save
    console.error("UIH auto-fix failed:", error);
  }

  return [];
}

export function deactivate() {}
