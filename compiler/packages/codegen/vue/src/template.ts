/**
 * UIH DSL Codegen - Template Generator (Vue)
 *
 * Generates Vue template code from IR layout tree.
 *
 * @module @uih-dsl/codegen-vue/template
 * @version 1.0.0
 */

import type { IRNode } from "@uih-dsl/ir";

export function generateTemplate(nodes: IRNode[], indent: number = 0): string {
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
    Fieldset: "fieldset",
    Legend: "legend",
    Datalist: "datalist",
    Optgroup: "optgroup",
    Meter: "meter",
    Progress: "progress",
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
    // SVG
    Svg: "svg",
    Path: "path",
    Circle: "circle",
    Rect: "rect",
    Line: "line",
    Polyline: "polyline",
    Polygon: "polyline",
    G: "g",
    Defs: "defs",
    LinearGradient: "linearGradient",
    Stop: "stop",
    // Semantic & Interactive
    Address: "address",
    Dialog: "dialog",
    Figure: "figure",
    Figcaption: "figcaption",
    Details: "details",
    Summary: "summary",
    Menu: "menu",
    Time: "time",
    Mark: "mark",
    Blockquote: "blockquote",
    Code: "code",
    Pre: "pre",
    Iframe: "iframe",
    Canvas: "canvas",
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
  const escaped = escapeTemplateText(node.value);
  return `${indentStr}${escaped}`;
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

const BOOLEAN_ATTRIBUTES = new Set([
  "checked",
  "disabled",
  "readonly",
  "required",
  "selected",
  "hidden",
  "autofocus",
  "multiple",
  "muted",
  "loop",
  "controls",
  "default",
  "reversed",
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
  
  // Handle conditional rendering 'if' attribute
  const ifAttr = node.attrs.find(a => a.key === "if");
  // Handle list rendering 'for' or 'each' attribute
  const forAttr = node.attrs.find(a => a.key === "for" || a.key === "each");
  
  const attrs = node.attrs.filter(a => a.key !== "if" && a.key !== "for" && a.key !== "each");
  
  let attrsStr = generateAttributes(attrs);
  
  if (forAttr) {
    attrsStr = `v-for="${escapeAttributeValue(forAttr.value)}" ` + attrsStr;
  }

  if (ifAttr) {
    attrsStr = `v-if="${escapeAttributeValue(ifAttr.value)}" ` + attrsStr;
  }
  
  // Trim leading space if needed
  attrsStr = attrsStr.trim();
  const attrsFinal = attrsStr.length > 0 ? " " + attrsStr : "";

  if (node.children.length === 0 || VOID_ELEMENTS.has(tag)) {
    return `${indentStr}<${tag}${attrsFinal} />`;
  }

  const childrenStr = generateTemplate(node.children, indent + 2);
  return `${indentStr}<${tag}${attrsFinal}>
${childrenStr}
${indentStr}</${tag}>`;
}

function generateAttributes(attrs: Array<{ key: string; value: string }>): string {
  return attrs.map((attr) => {
    let key = attr.key;
    let value = attr.value;

    if (BOOLEAN_ATTRIBUTES.has(key) && (value === "true" || value === "")) {
      return key;
    }

    // Map events: onClick -> @click
    if (key.startsWith("on") && key.length > 2 && key[2] === key[2].toUpperCase()) {
      const eventName = key.slice(2).toLowerCase();
      key = `@${eventName}`;

      // Handle toggle() magic
      if (value.includes("toggle(")) {
        const match = value.match(/toggle\((.*)\)/);
        if (match) {
          const target = match[1].trim();
          // Vue: isOpen = !isOpen
          value = `${target} = !${target}`;
          return `${key}="${value}"`;
        }
      }
      
      // Handle simple assignment: var = val
      const assignmentMatch = value.match(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)\s*$/);
      if (assignmentMatch) {
        // Vue allows assignment in template directly
        return `${key}="${value}"`;
      }
    }

    // Bind dynamic values (identifiers, expressions)
    // Heuristic: if value looks like a variable or expression, use :key
    if (/^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(value) && !BOOLEAN_ATTRIBUTES.has(key)) {
        // e.g. key="item.id" -> :key="item.id"
        // e.g. title="pageTitle" -> :title="pageTitle"
        // Don't bind if it's a simple string value that doesn't look like an ID?
        // Actually, standard Vue practice: if you want string, use key="val". If var, :key="val".
        // In UIH IR, we don't have type info.
        // Let's strictly bind 'key' because it's almost always a variable in loops.
        if (key === "key") {
            return `:${key}="${value}"`;
        }
        // For other attributes, it's ambiguous. "blue" could be string or var.
        // For now, let's leave them as static unless user explicitly uses :attr syntax (which DSL doesn't support well yet).
        // Or we could try to detect... let's stick to safe static for now, except 'key'.
    }

    // Transform style tokens: "color.bg" -> "var(--color-bg)"
    if (key === "style") {
      value = value.replace(/\b([a-z][a-zA-Z0-9]*)\.([a-zA-Z0-9]+)\b/g, "var(--$1-$2)");
    }

    return `${key}="${escapeAttributeValue(value)}"`;
  }).join(" ");
}

function escapeTemplateText(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
