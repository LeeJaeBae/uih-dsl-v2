/**
 * UIH DSL Codegen - JSX Generator
 *
 * Generates JSX code from IR layout tree.
 *
 * @module @uih-dsl/codegen-react/jsx
 * @version 1.1.0
 */

import type { IRNode } from "@uih-dsl/ir";

export function generateJSX(nodes: IRNode[], indent: number = 0, definedVars: Set<string> = new Set()): string {
  return nodes.map((node) => generateNode(node, indent, definedVars)).join("\n");
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
    Image: "img",
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

function generateNode(node: IRNode, indent: number, definedVars: Set<string>): string {
  if (node.type === "Text") {
    return generateTextNode(node, indent);
  } else {
    return generateComponentNode(node, indent, definedVars);
  }
}

function generateTextNode(node: { type: "Text"; value: string }, indent: number): string {
  const indentStr = " ".repeat(indent);
  // Use JSON.stringify to safely escape text content
  return `${indentStr}{${JSON.stringify(node.value)}}`;
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
  indent: number,
  definedVars: Set<string>
): string {
  const indentStr = " ".repeat(indent);
  const tag = mapToHTMLTag(node.tag);
  
  // Handle conditional rendering 'if' attribute
  const ifAttr = node.attrs.find(a => a.key === "if");
  
  // Handle list rendering 'for' or 'each' attribute
  // 'for' is ambiguous: it can be 'htmlFor' (label) or loop.
  // We differentiate by checking if value contains " in ".
  const loopAttr = node.attrs.find(a => 
    a.key === "each" || (a.key === "for" && a.value.includes(" in "))
  );

  const attrs = node.attrs.filter(a => {
    if (a.key === "if") return false;
    if (a.key === "each") return false;
    if (a.key === "for" && a.value.includes(" in ")) return false;
    return true;
  });
  
  // Update scope if we are in a loop
  let localVars = definedVars;
  let loopItemVar = "";
  
  if (loopAttr) {
    const match = loopAttr.value.match(/^\s*(.+?)\s+in\s+(.+?)\s*$/);
    if (match) {
      loopItemVar = match[1]; // "item"
      // Create new scope with loop variable
      localVars = new Set(definedVars);
      localVars.add(loopItemVar);
    }
  }

  const attrsStr = generateAttributes(attrs, localVars);
  const attrsFinal = attrsStr.length > 0 ? " " + attrsStr : "";

  let jsx = "";

  if (node.children.length === 0 || VOID_ELEMENTS.has(tag)) {
    jsx = `${indentStr}<${tag}${attrsFinal} />`;
  } else {
    const childrenStr = generateJSX(node.children, indent + 2, localVars);
    jsx = `${indentStr}<${tag}${attrsFinal}>
${childrenStr}
${indentStr}</${tag}>`;
  }

  if (loopAttr && loopItemVar) {
    const match = loopAttr.value.match(/^\s*(.+?)\s+in\s+(.+?)\s*$/);
    if (match) {
      const [_, item, items] = match;
      // If no key is provided, React warns. 
      // We rely on the user to provide a key attribute, or the index if safe.
      // If the user provided key:"item.id", generateAttributes handles the expression.
      // If no key attr is present, we could inject key={i}, but let's stick to raw map for now or use index as fallback?
      // Let's expose index 'i' in the map callback so it can be used.
      jsx = `${indentStr}{${items}.map((${item}, i) => (
${jsx}
${indentStr}))}`;
    }
  }

  if (ifAttr) {
    return `${indentStr}{${ifAttr.value} && (
${jsx}
${indentStr})}`;
  }

  return jsx;
}

function generateAttributes(attrs: Array<{ key: string; value: string }>, definedVars: Set<string>): string {
  return attrs
    .map((attr) => {
      let key = attr.key === "class" ? "className" : attr.key;
      if (key === "for") key = "htmlFor";

      // Convert SVG attributes (e.g., stroke-width) to camelCase for React
      if (!key.startsWith("data-") && !key.startsWith("aria-") && key.includes("-")) {
        key = toCamelCase(key);
      }

      if (BOOLEAN_ATTRIBUTES.has(attr.key) && (attr.value === "true" || attr.value === "")) {
        return key;
      }

      if (key === "style") {
        // Transform style tokens: "color.bg" -> "var(--color-bg)"
        const transformedStyle = attr.value.replace(/\b([a-z][a-zA-Z0-9]*)\.([a-zA-Z0-9]+)\b/g, "var(--$1-$2)");
        const styleObj = parseStyleString(transformedStyle);
        return `style={${JSON.stringify(styleObj)}}`;
      }

      if (key.startsWith("on")) {
        // 1. Handle toggle(var)
        if (attr.value.includes("toggle(")) {
          const match = attr.value.match(/toggle\((.*)\)/);
          if (match) {
            const target = match[1];
            return `${key}={${"() => set"}${capitalize(target)}(!${target})}`;
          }
        }

        // 2. Handle simple assignment: var = val
        const assignmentMatch = attr.value.match(/^\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*(.+)\s*$/);
        if (assignmentMatch) {
          const target = assignmentMatch[1];
          const value = assignmentMatch[2];
          return `${key}={${"() => set"}${capitalize(target)}(${value})}`;
        }

        // 3. Handle function references (e.g. handleClick, handleSUBMIT)
        // If value is a simple identifier, pass it as a reference
        if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(attr.value)) {
          return `${key}={${attr.value}}`;
        }
      }

      // Handle variable references/expressions
      // Logic: If it contains dots, OR if it is a known variable in scope -> Expression
      // Otherwise -> String Literal
      const isDotPath = attr.value.includes("."); // Simple check for dot notation
      const isDefinedVar = definedVars.has(attr.value);
      
      // Also check if it looks like a variable but isn't defined (for safety or strict mode?)
      // Currently we default to string if not defined. This allows 'value="junior"' to be string.
      
      if (isDotPath || isDefinedVar) {
         return `${key}={${attr.value}}`;
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

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
