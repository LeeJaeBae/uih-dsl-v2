export interface SimplifiedNode {
  type: string;
  children?: SimplifiedNode[];
  layout?: {
    mode: string;
    align?: string; // "C C", "SB C"
    gap?: number;
    pad?: string;
  };
  style?: {
    sizing?: string; // "fill hug" (W H)
    w?: number; // only if fixed
    h?: number; // only if fixed
    bg?: string;
    border?: string; // "#000 1"
    radius?: number;
    shadow?: boolean;
  };
  text?: {
    content: string;
    size?: number;
    weight?: string;
    color?: string;
    align?: string;
  };
}

export function serializeNode(node: SceneNode): SimplifiedNode | null {
  if (!node.visible) return null;

  const base: SimplifiedNode = {
    type: node.type === "INSTANCE" || node.type === "COMPONENT" ? "FRAME" : node.type,
  };

  // 1. Layout Props (Auto Layout)
  if ("layoutMode" in node && node.layoutMode !== "NONE") {
    const layout: any = { mode: node.layoutMode === "HORIZONTAL" ? "H" : "V" };
    
    // Alignment
    const prime = alignShort(node.primaryAxisAlignItems);
    const counter = alignShort(node.counterAxisAlignItems);
    if (prime !== "S" || counter !== "S") layout.align = `${prime} ${counter}`;

    if (node.itemSpacing !== figma.mixed && node.itemSpacing > 0) layout.gap = Math.round(node.itemSpacing);
    
    // Simplify padding
    const pt = typeof node.paddingTop === 'number' ? node.paddingTop : 0;
    const pr = typeof node.paddingRight === 'number' ? node.paddingRight : 0;
    const pb = typeof node.paddingBottom === 'number' ? node.paddingBottom : 0;
    const pl = typeof node.paddingLeft === 'number' ? node.paddingLeft : 0;
    if (pt + pr + pb + pl > 0) {
        layout.pad = `${Math.round(pt)} ${Math.round(pr)} ${Math.round(pb)} ${Math.round(pl)}`;
    }
    base.layout = layout;
  }

  // 2. Geometry & Style & Sizing
  const style: any = {};
  
  // Layout Sizing
  let wMode = "fixed";
  let hMode = "fixed";
  
  if ("layoutSizingHorizontal" in node && node.layoutSizingHorizontal !== figma.mixed) {
      if (node.layoutSizingHorizontal === "FILL") wMode = "fill";
      else if (node.layoutSizingHorizontal === "HUG") wMode = "hug";
  }
  
  if ("layoutSizingVertical" in node && node.layoutSizingVertical !== figma.mixed) {
      if (node.layoutSizingVertical === "FILL") hMode = "fill";
      else if (node.layoutSizingVertical === "HUG") hMode = "hug";
  }

  if (wMode !== "fixed" || hMode !== "fixed") {
      style.sizing = `${wMode} ${hMode}`;
  }

  // Explicit dimensions
  if (wMode === "fixed" || node.type === "RECTANGLE" || node.type === "VECTOR") style.w = Math.round(node.width);
  if (hMode === "fixed" || node.type === "RECTANGLE" || node.type === "VECTOR") style.h = Math.round(node.height);
  
  // Background
  if ("fills" in node && node.fills !== figma.mixed && node.fills.length > 0) {
    const fill = node.fills[0];
    if (fill.type === 'SOLID') {
        style.bg = rgbToHex(fill.color);
    } else if (fill.type === 'IMAGE') {
        style.bg = 'IMG';
    }
  }
  
  // Border (Stroke)
  if ("strokes" in node && node.strokes !== figma.mixed && node.strokes.length > 0) {
      const weight = typeof node.strokeWeight === 'number' ? node.strokeWeight : 1;
      if (weight > 0) {
          const stroke = node.strokes[0];
          if (stroke.type === 'SOLID') {
              style.border = `${rgbToHex(stroke.color)} ${weight}`;
          }
      }
  }

  // Corner Radius
  if ("cornerRadius" in node) {
      if (node.cornerRadius !== figma.mixed && typeof node.cornerRadius === 'number' && node.cornerRadius > 0) {
        style.radius = node.cornerRadius;
      }
  }
  
  // Effects (Shadow)
  if ("effects" in node && node.effects !== figma.mixed && node.effects.length > 0) {
      const hasShadow = node.effects.some(e => e.type === 'DROP_SHADOW' && e.visible);
      if (hasShadow) style.shadow = true;
  }

  if (Object.keys(style).length > 0) base.style = style;

  // 3. Text Specific
  if (node.type === "TEXT") {
    base.text = {
      content: node.characters,
    };
    if (typeof node.fontSize === "number") base.text.size = node.fontSize;
    
    // fontWeight can be mixed or symbol
    if (node.fontWeight !== figma.mixed) {
        base.text.weight = String(node.fontWeight);
    }
    
    if (node.textAlignHorizontal !== "LEFT" && node.textAlignHorizontal !== figma.mixed) {
        base.text.align = node.textAlignHorizontal === "CENTER" ? "C" : "R";
    }
    
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

function alignShort(align: string): string {
    if (align === "MIN") return "S"; // Start
    if (align === "MAX") return "E"; // End
    if (align === "CENTER") return "C";
    if (align === "SPACE_BETWEEN") return "SB";
    return "S";
}

function rgbToHex(color: RGB): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}
