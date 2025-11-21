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
    Image: "img",
    Video: "video",
    Audio: "audio",
    // Other
    A: "a",
    Card: "div",
    CardContent: "div",
    Hr: "hr",
    Br: "br",
  };

  return htmlTagMap[uihTag] || uihTag;
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

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

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

  if (node.children.length === 0 || VOID_ELEMENTS.has(tag)) {
    return `${indentStr}<${tag}${attrsStr} />`;
  }

  const childrenStr = generateJSX(node.children, indent + 2);
  return `${indentStr}<${tag}${attrsStr}>
${childrenStr}
${indentStr}</${tag}>`;
}

function generateAttributes(attrs: Array<{ key: string; value: string }>): string {
  return attrs
    .map((attr) => {
      const key = attr.key === "class" ? "className" : attr.key;

      if (key === "style") {
        const styleObj = parseStyleString(attr.value);
        return `style={${JSON.stringify(styleObj)}}`;
      }

      return `${key}="${escapeAttributeValue(attr.value)}"`;
    })
    .join(" ");
}

function parseStyleString(styleStr: string): Record<string, string> {
  const styleObj: Record<string, string> = {};
  const rules = styleStr.split(";");

  rules.forEach((rule) => {
    const [prop, ...values] = rule.split(":");
    if (prop && values.length > 0) {
      const key = toCamelCase(prop.trim());
      const value = values.join(":").trim();
      if (key && value) {
        styleObj[key] = value;
      }
    }
  });

  return styleObj;
}

function toCamelCase(str: string): string {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
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
