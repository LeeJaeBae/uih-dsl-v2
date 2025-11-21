export interface SimplifiedNode {
  type: string;
  children?: SimplifiedNode[];
  layout?: {
    mode: string;
    align?: string; // Combined alignment
    gap?: number;
    pad?: string; // Combined padding "10 20"
  };
  style?: {
    w?: number; // width
    h?: number; // height
    bg?: string; // background color (first solid fill)
    radius?: number;
  };
  text?: {
    content: string;
    size?: number;
    weight?: string;
    color?: string;
  };
}

export function serializeNode(node: SceneNode): SimplifiedNode | null {
  if (!node.visible) return null;

  const base: SimplifiedNode = {
    type: node.type === "INSTANCE" || node.type === "COMPONENT" ? "FRAME" : node.type, // Simplify types
  };

  // 1. Layout Props (Frame/Instance)
  if ("layoutMode" in node && node.layoutMode !== "NONE") {
    const layout: any = { mode: node.layoutMode === "HORIZONTAL" ? "H" : "V" };
    
    // Simplify alignment
    const prime = node.primaryAxisAlignItems === "CENTER" ? "C" : node.primaryAxisAlignItems === "SPACE_BETWEEN" ? "SB" : "S";
    const counter = node.counterAxisAlignItems === "CENTER" ? "C" : "S";
    if (prime !== "S" || counter !== "S") layout.align = `${prime} ${counter}`;

    if (node.itemSpacing > 0) layout.gap = Math.round(node.itemSpacing);
    
    // Simplify padding
    const pt = node.paddingTop || 0;
    const pr = node.paddingRight || 0;
    const pb = node.paddingBottom || 0;
    const pl = node.paddingLeft || 0;
    if (pt + pr + pb + pl > 0) {
        layout.pad = `${Math.round(pt)} ${Math.round(pr)} ${Math.round(pb)} ${Math.round(pl)}`;
    }
    base.layout = layout;
  }

  // 2. Geometry & Style
  const style: any = {};
  if ("width" in node) style.w = Math.round(node.width);
  if ("height" in node) style.h = Math.round(node.height);
  
  // Extract only the first solid fill as background
  if ("fills" in node && node.fills !== figma.mixed && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
        style.bg = rgbToHex(fill.color);
    } else if (fill.type === 'IMAGE') {
        style.bg = 'IMG';
    }
  }
  
  if ("cornerRadius" in node && typeof node.cornerRadius === "number" && node.cornerRadius > 0) {
    style.radius = node.cornerRadius;
  }

  if (Object.keys(style).length > 0) base.style = style;

  // 3. Text Specific
  if (node.type === "TEXT") {
    base.text = {
      content: node.characters.substring(0, 50), // Truncate text
    };
    if (typeof node.fontSize === "number") base.text.size = node.fontSize;
    
    // Text Color
    if (node.fills !== figma.mixed && node.fills.length > 0 && node.fills[0].type === 'SOLID') {
        base.text.color = rgbToHex(node.fills[0].color);
    }
  }

  // 4. Children (Recursive)
  if ("children" in node) {
    const children = node.children
      .map((child) => serializeNode(child))
      .filter((n): n is SimplifiedNode => n !== null);
    
    if (children.length > 0) {
        base.children = children;
    }
  }

  return base;
}

function rgbToHex(color: RGB): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}
