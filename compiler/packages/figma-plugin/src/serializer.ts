export interface SimplifiedNode {
  id: string;
  name: string;
  type: string;
  children?: SimplifiedNode[];
  layout?: {
    mode: string;
    primaryAxisAlign?: string;
    counterAxisAlign?: string;
    gap?: number;
    padding?: { t: number; r: number; b: number; l: number };
  };
  style?: {
    width?: number;
    height?: number;
    fills?: any[];
    strokes?: any[];
    radius?: number;
    opacity?: number;
    effects?: any[];
  };
  text?: {
    content: string;
    fontSize: number;
    fontWeight: string;
    fontFamily: string;
    textAlign: string;
    color: string;
  };
}

export function serializeNode(node: SceneNode): SimplifiedNode | null {
  if (!node.visible) return null;

  const base: SimplifiedNode = {
    id: node.id,
    name: node.name,
    type: node.type,
  };

  // 1. Layout Props (Frame/Instance)
  if ("layoutMode" in node) {
    base.layout = {
      mode: node.layoutMode,
      primaryAxisAlign: node.primaryAxisAlignItems,
      counterAxisAlign: node.counterAxisAlignItems,
      gap: node.itemSpacing,
      padding: {
        t: node.paddingTop,
        r: node.paddingRight,
        b: node.paddingBottom,
        l: node.paddingLeft,
      },
    };
  }

  // 2. Geometry & Style
  const style: any = {};
  if ("width" in node) style.width = node.width;
  if ("height" in node) style.height = node.height;
  
  if ("fills" in node && node.fills !== figma.mixed) {
    style.fills = simplifyPaints(node.fills as ReadonlyArray<Paint>);
  }
  
  if ("cornerRadius" in node) {
    if (node.cornerRadius !== figma.mixed) {
        style.radius = node.cornerRadius;
    }
  }
  
  if ("opacity" in node) style.opacity = node.opacity;

  if (Object.keys(style).length > 0) {
      base.style = style;
  }

  // 3. Text Specific
  if (node.type === "TEXT") {
    base.text = {
      content: node.characters,
      fontSize: typeof node.fontSize === "number" ? node.fontSize : 16,
      fontWeight: "normal", // fontName 처리 필요
      fontFamily: (node.fontName as FontName)?.family || "sans-serif",
      textAlign: node.textAlignHorizontal,
      color: "#000000",
    };

    // 텍스트 컬러 추출
    if (node.fills !== figma.mixed && node.fills.length > 0 && node.fills[0].type === 'SOLID') {
        base.text.color = rgbToHex(node.fills[0].color);
    }
  }

  // 4. Children (Recursive)
  if ("children" in node) {
    base.children = node.children
      .map((child) => serializeNode(child))
      .filter((n): n is SimplifiedNode => n !== null);
  }

  return base;
}

function simplifyPaints(paints: ReadonlyArray<Paint>) {
  return paints.map(p => {
    if (p.type === 'SOLID') {
      return { type: 'SOLID', color: rgbToHex(p.color), opacity: p.opacity };
    }
    if (p.type === 'IMAGE') {
      return { type: 'IMAGE', scaleMode: p.scaleMode };
    }
    return { type: p.type };
  });
}

function rgbToHex(color: RGB): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0');
  return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`;
}
