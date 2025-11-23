/**
 * UIH DSL Codegen - Template Generator (Svelte)
 *
 * Generates Svelte template code from IR layout tree.
 *
 * @module @uih-dsl/codegen-svelte/template
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
  
  const attrsStr = generateAttributes(attrs);
  const attrsFinal = attrsStr.length > 0 ? " " + attrsStr : "";

  let componentCode = "";
  if (node.children.length === 0 || VOID_ELEMENTS.has(tag)) {
    componentCode = `${indentStr}<${tag}${attrsFinal} />`;
  } else {
    const childrenStr = generateTemplate(node.children, indent + 2);
    componentCode = `${indentStr}<${tag}${attrsFinal}>
${childrenStr}
${indentStr}</${tag}>`;
  }

  // Wrap in #each block if 'for' attribute is present
  if (forAttr) {
    const match = forAttr.value.match(/^\s*(.+?)\s+in\s+(.+?)\s*$/);
    if (match) {
      const [_, item, items] = match;
      // Check for key attribute in original attrs (it's already in attrsStr as key="{...}")
      // Svelte syntax: {#each items as item (key)} ... {/each}
      // We need to extract the raw value of the key attribute to put it in the each block
      const keyAttr = node.attrs.find(a => a.key === "key");
      let eachStart = `{#each ${items} as ${item}}`;
      
      if (keyAttr) {
        eachStart = `{#each ${items} as ${item} (${keyAttr.value})}`;
      }
      
      componentCode = `${indentStr}${eachStart}
${componentCode}
${indentStr}{/each}`;
    }
  }

  if (ifAttr) {
    return `${indentStr}{#if ${ifAttr.value}}
${componentCode}
${indentStr}{/if}`;
  }

  return componentCode;
}

function generateAttributes(attrs: Array<{ key: string; value: string }>): string {
  return attrs.map((attr) => {
    let key = attr.key;
    let value = attr.value;

    if (BOOLEAN_ATTRIBUTES.has(key) && (value === "true" || value === "")) {
      return key;
    }

    // Map events: onClick -> onclick (Svelte 5 uses attributes)
    if (key.startsWith("on") && key.length > 2 && key[2] === key[2].toUpperCase()) {
      // Convert onClick -> onclick
      key = key.toLowerCase();

      // Handle toggle() magic
      if (value.includes("toggle(")) {
        const match = value.match(/toggle\((.*)\)/);
        if (match) {
          const target = match[1].trim();
          // Svelte: () => target = !target
          return `${key}={() => ${target} = !${target}}`;
        }
      }
      
      // Check if it's an inline assignment or expression
      // Simple heuristic: contains =, ++, --, +, -, *, / and is NOT just a function name
      const isExpression = /[\=\+\-\*\/]/.test(value) || value.includes("(") || value.includes(")");
      
      if (isExpression) {
         // If it looks like a function call "handler()", we also wrap it
         // If it's "count = count + 1", we wrap it
         return `${key}={() => ${value}}`;
      }
      
      // Standard handler: onclick={handleClick}
      return `${key}={${value}}`;
    }

    // Bind dynamic values
    // If key="item.id", render as key={item.id} to avoid string literal "item.id"
    // But wait, if we use keyed each block `{#each ... (key)}`, we might not want `key={...}` on the element itself?
    // Svelte warns if key attribute is used on element inside keyed each? No, React does. Svelte uses (key) syntax.
    // However, if the user put `key` attr, it might be intended for the loop.
    // We leave it on the element too? Usually harmless or used for other libs.
    // Let's handle expressions generally.
    if (/^[a-zA-Z_$][a-zA-Z0-9_$.]*$/.test(value) && !BOOLEAN_ATTRIBUTES.has(key)) {
         return `${key}={${value}}`;
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
