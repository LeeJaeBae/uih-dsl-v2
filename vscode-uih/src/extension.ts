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
import { smartCompile } from "@uih-dsl/cli/src/utils/smart-compile.js";
import Anthropic from "@anthropic-ai/sdk";
import type { ASTRoot } from "@uih-dsl/parser";
import type { UIHIR } from "@uih-dsl/ir";

let statusBarItem: vscode.StatusBarItem;

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

/**
 * Preview compiled UI
 */
async function handlePreview(context: vscode.ExtensionContext) {
  const editor = vscode.window.activeTextEditor;

  if (!editor || editor.document.languageId !== "uih") {
    vscode.window.showErrorMessage("Open a .uih file to preview");
    return;
  }

  const uihCode = editor.document.getText();

  try {
    // Step 1: Tokenize
    const tokens = tokenize(uihCode);

    // Step 2: Parse
    const parseResult = parse(tokens);

    if (parseResult.errors.length > 0) {
      const errorMsg = parseResult.errors
        .map((err) => {
          const loc = err.location ? ` at line ${err.location.line}, column ${err.location.column}` : "";
          return `${err.message}${loc}`;
        })
        .join("\n");
      vscode.window.showErrorMessage(`Parse errors:\n${errorMsg}`);
      return;
    }

    if (!parseResult.ast) {
      vscode.window.showErrorMessage("Failed to parse UIH file");
      return;
    }

    // Create webview panel
    const panel = vscode.window.createWebviewPanel(
      "uihPreview",
      "UIH Live Preview",
      vscode.ViewColumn.Beside,
      {
        enableScripts: true,
        localResourceRoots: [],
      }
    );

    // Set HTML content with live UI rendering
    panel.webview.html = getPreviewHtml(parseResult.ast);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Preview failed: ${error.message}`);
  }
}

/**
 * Compile UIH to target framework
 */
async function handleCompile() {
  const editor = vscode.window.activeTextEditor;

  if (!editor || editor.document.languageId !== "uih") {
    vscode.window.showErrorMessage("Open a .uih file to compile");
    return;
  }

  // Ask for target framework
  const target = await vscode.window.showQuickPick(["react", "vue", "svelte"], {
    placeHolder: "Select target framework",
  });

  if (!target) {
    return;
  }

  const uihCode = editor.document.getText();

  try {
    // Step 1: Tokenize
    const tokens = tokenize(uihCode);

    // Step 2: Parse
    const parseResult = parse(tokens);

    if (parseResult.errors.length > 0) {
      const errorMsg = parseResult.errors
        .map((err) => `${err.message}`)
        .join("\n");
      vscode.window.showErrorMessage(`Parse errors:\n${errorMsg}`);
      return;
    }

    if (!parseResult.ast) {
      vscode.window.showErrorMessage("Failed to parse UIH file");
      return;
    }

    // Step 3: Create IR
    const irResult = createIR(parseResult.ast, parseResult.errors);

    if (irResult.errors.length > 0) {
      const errorMsg = irResult.errors.map((err) => err.message).join("\n");
      vscode.window.showErrorMessage(`IR errors:\n${errorMsg}`);
      return;
    }

    // Step 4: Generate code
    let codeResult;
    let fileExtension;
    let language;

    switch (target) {
      case "react":
        codeResult = generateReact(irResult);
        fileExtension = ".tsx";
        language = "typescriptreact";
        break;
      case "vue":
        codeResult = generateVue(irResult);
        fileExtension = ".vue";
        language = "vue";
        break;
      case "svelte":
        codeResult = generateSvelte(irResult);
        fileExtension = ".svelte";
        language = "svelte";
        break;
      default:
        vscode.window.showErrorMessage(`Unknown target: ${target}`);
        return;
    }

    // Create output file
    const fileName = `Page${fileExtension}`;
    const doc = await vscode.workspace.openTextDocument({
      language: language,
      content: codeResult.code,
    });

    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

    vscode.window.showInformationMessage(`✅ Compiled to ${target}`);
  } catch (error: any) {
    vscode.window.showErrorMessage(`Compilation failed: ${error.message}`);
  }
}

/**
 * Generate preview HTML with live UI rendering
 */
function getPreviewHtml(ast: ASTRoot): string {
  // Extract style properties
  const cssVars = ast.style.properties.length > 0
    ? generateCSSVariables(ast.style.properties)
    : "";

  // Extract layout nodes
  const htmlContent = ast.layout.children.length > 0
    ? renderNodes(ast.layout.children)
    : "<p>No layout found</p>";

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${cssVars}
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;
}

/**
 * Generate CSS variables from style properties
 */
function generateCSSVariables(properties: Array<{ key: string; value: string }>): string {
  const vars = properties
    .map(({ key, value }) => `  --${key.replace(/\./g, "-")}: ${value};`)
    .join("\n");
  return vars ? `:root {\n${vars}\n}` : "";
}

/**
 * Render UIH nodes to HTML
 */
function renderNodes(nodes: any[]): string {
  return nodes.map((node) => renderNode(node)).join("\n");
}

/**
 * Render a single UIH node to HTML
 */
function renderNode(node: any): string {
  if (node.type === "Text") {
    return escapeHtml(node.value);
  }

  if (node.type === "Component") {
    return renderElement(node);
  }

  return "";
}

/**
 * Render an element node to HTML
 */
function renderElement(node: any): string {
  const tagName = getHTMLTag(node.tag);
  const attrs = renderAttributes(node.attributes);
  const children = node.children ? renderNodes(node.children) : "";

  // Self-closing tags
  if (["img", "input", "br", "hr"].includes(tagName.toLowerCase())) {
    return `<${tagName}${attrs} />`;
  }

  return `<${tagName}${attrs}>${children}</${tagName}>`;
}

/**
 * Map UIH element names to HTML tags
 */
function getHTMLTag(name: string): string {
  const htmlElements: Record<string, string> = {
    // Layout
    Div: "div",
    Section: "section",
    Article: "article",
    Aside: "aside",
    Header: "header",
    Footer: "footer",
    Nav: "nav",
    Main: "main",
    // Text
    H1: "h1",
    H2: "h2",
    H3: "h3",
    H4: "h4",
    H5: "h5",
    H6: "h6",
    P: "p",
    Span: "span",
    Text: "span",
    // Form
    Form: "form",
    Input: "input",
    Textarea: "textarea",
    Button: "button",
    Label: "label",
    Select: "select",
    Option: "option",
    // List
    Ul: "ul",
    Ol: "ol",
    Li: "li",
    // Table
    Table: "table",
    Thead: "thead",
    Tbody: "tbody",
    Tr: "tr",
    Td: "td",
    Th: "th",
    // Media
    Img: "img",
    Video: "video",
    Audio: "audio",
    // Other
    A: "a",
    Card: "div",
    CardContent: "div",
  };

  return htmlElements[name] || "div";
}

/**
 * Render element attributes
 */
function renderAttributes(attrs: Array<{ key: string; value: string }>): string {
  if (!attrs || attrs.length === 0) return "";

  const attrStrings = attrs.map((attr) => {
    const value = escapeHtml(attr.value);
    return `${attr.key}="${value}"`;
  }).join(" ");

  return " " + attrStrings;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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

export function deactivate() {
  console.log('UIH v2 extension deactivated');
}
