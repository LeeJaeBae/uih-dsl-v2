/**
 * UIH DSL Codegen - JSX Generator
 *
 * Generates JSX code from IR layout tree.
 *
 * @module @uih-dsl/codegen-react/jsx
 * @version 1.0.0
 */

import type { IRNode } from "@uih-dsl/ir";

export function generateJSX(nodes: IRNode[], indent: number = 0): string {
  return nodes.map((node) => generateNode(node, indent)).join("\n");
}

function mapToHTMLTag(uihTag: string): string {
  const htmlTagMap: Record<string, string> = {
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

  return htmlTagMap[uihTag] || "div";
}

function generateNode(node: IRNode, indent: number): string {
  if (node.type === "Text") {
    return generateTextNode(node, indent);
  } else {
    return generateComponentNode(node, indent);
  }
}

function generateTextNode(node: { type: "Text"; value: string }, indent: number): string {
  const indentStr = " ".repeat(indent);
  const escaped = escapeJSXText(node.value);
  return `${indentStr}{"${escaped}"}`;
}

function generateComponentNode(
  node: {
    type: "Component";
    tag: string;
    attrs: Array<{ key: string; value: string }>;
    children: IRNode[];
  },
  indent: number
): string {
  const indentStr = " ".repeat(indent);
  const tag = mapToHTMLTag(node.tag);
  const attrs = generateAttributes(node.attrs);
  const attrsStr = attrs.length > 0 ? " " + attrs : "";

  if (node.children.length === 0) {
    return `${indentStr}<${tag}${attrsStr} />`;
  }

  const childrenStr = generateJSX(node.children, indent + 2);
  return `${indentStr}<${tag}${attrsStr}>
${childrenStr}
${indentStr}</${tag}>`;
}

function generateAttributes(attrs: Array<{ key: string; value: string }>): string {
  return attrs.map((attr) => {
    const key = attr.key === "class" ? "className" : attr.key;
    return `${key}="${escapeAttributeValue(attr.value)}"`;
  }).join(" ");
}

function escapeJSXText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "\\r")
    .replace(/\t/g, "\\t");
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
