/**
 * Tests for UIH Runtime Core - Style Runtime
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  pathToCSSVariable,
  tokenToCSSDeclaration,
  generateCSSRoot,
  StyleRuntime,
} from "../src/style-runtime.js";
import type { StyleToken, StyleTheme } from "../src/style-runtime.js";

describe("pathToCSSVariable", () => {
  it("should convert path to CSS variable", () => {
    expect(pathToCSSVariable(["color", "primary"])).toBe("--color-primary");
    expect(pathToCSSVariable(["font", "size", "lg"])).toBe("--font-size-lg");
    expect(pathToCSSVariable(["spacing", "4"])).toBe("--spacing-4");
  });

  it("should handle single-segment paths", () => {
    expect(pathToCSSVariable(["primary"])).toBe("--primary");
  });

  it("should handle empty path", () => {
    expect(pathToCSSVariable([])).toBe("--");
  });
});

describe("tokenToCSSDeclaration", () => {
  it("should convert token to CSS declaration", () => {
    const token: StyleToken = {
      path: ["color", "primary"],
      value: "#0E5EF7",
    };

    expect(tokenToCSSDeclaration(token)).toBe("--color-primary: #0E5EF7;");
  });

  it("should handle numeric values", () => {
    const token: StyleToken = {
      path: ["spacing", "4"],
      value: 16,
    };

    expect(tokenToCSSDeclaration(token)).toBe("--spacing-4: 16;");
  });
});

describe("generateCSSRoot", () => {
  it("should generate :root block with sorted tokens", () => {
    const tokens: StyleToken[] = [
      { path: ["color", "primary"], value: "#0E5EF7" },
      { path: ["color", "secondary"], value: "#6C757D" },
      { path: ["spacing", "4"], value: 16 },
    ];

    const css = generateCSSRoot(tokens);

    expect(css).toContain(":root {");
    expect(css).toContain("--color-primary: #0E5EF7;");
    expect(css).toContain("--color-secondary: #6C757D;");
    expect(css).toContain("--spacing-4: 16;");
    expect(css).toContain("}");
  });

  it("should sort tokens alphabetically", () => {
    const tokens: StyleToken[] = [
      { path: ["z", "token"], value: "last" },
      { path: ["a", "token"], value: "first" },
      { path: ["m", "token"], value: "middle" },
    ];

    const css = generateCSSRoot(tokens);
    const aIndex = css.indexOf("--a-token");
    const mIndex = css.indexOf("--m-token");
    const zIndex = css.indexOf("--z-token");

    expect(aIndex).toBeLessThan(mIndex);
    expect(mIndex).toBeLessThan(zIndex);
  });

  it("should handle empty token array", () => {
    const css = generateCSSRoot([]);

    expect(css).toBe("");
  });
});

describe("StyleRuntime", () => {
  let runtime: StyleRuntime;

  beforeEach(() => {
    runtime = new StyleRuntime();
  });

  describe("Token Injection", () => {
    it("should inject tokens", () => {
      const tokens: StyleToken[] = [
        { path: ["color", "primary"], value: "#0E5EF7" },
      ];

      runtime.inject(tokens);

      expect(runtime.getVariable("--color-primary")).toBe("#0E5EF7");
    });

    it("should handle multiple token injections", () => {
      const tokens1: StyleToken[] = [
        { path: ["color", "primary"], value: "#0E5EF7" },
      ];
      const tokens2: StyleToken[] = [
        { path: ["color", "secondary"], value: "#6C757D" },
      ];

      runtime.inject(tokens1);
      runtime.inject(tokens2);

      expect(runtime.getVariable("--color-primary")).toBe("#0E5EF7");
      expect(runtime.getVariable("--color-secondary")).toBe("#6C757D");
    });
  });

  describe("Variable Management", () => {
    it("should set and get CSS variables", () => {
      runtime.setVariable("--custom-color", "#FF0000");

      expect(runtime.getVariable("--custom-color")).toBe("#FF0000");
    });

    it("should handle variables without -- prefix", () => {
      runtime.setVariable("custom-color", "#FF0000");

      expect(runtime.getVariable("--custom-color")).toBe("#FF0000");
    });

    it("should return undefined for non-existent variables", () => {
      expect(runtime.getVariable("--non-existent")).toBeUndefined();
    });

    it("should update existing variables", () => {
      runtime.setVariable("--color", "#FF0000");
      expect(runtime.getVariable("--color")).toBe("#FF0000");

      runtime.setVariable("--color", "#00FF00");
      expect(runtime.getVariable("--color")).toBe("#00FF00");
    });
  });

  describe("Theme Application", () => {
    it("should apply theme", () => {
      const theme: StyleTheme = {
        name: "dark",
        tokens: [
          { path: ["color", "bg"], value: "#000000" },
          { path: ["color", "text"], value: "#FFFFFF" },
        ],
      };

      runtime.applyTheme(theme);

      expect(runtime.getVariable("--color-bg")).toBe("#000000");
      expect(runtime.getVariable("--color-text")).toBe("#FFFFFF");
    });

    it("should override existing tokens when applying theme", () => {
      runtime.setVariable("--color-bg", "#FFFFFF");

      const theme: StyleTheme = {
        name: "dark",
        tokens: [{ path: ["color", "bg"], value: "#000000" }],
      };

      runtime.applyTheme(theme);

      expect(runtime.getVariable("--color-bg")).toBe("#000000");
    });
  });

  describe("Runtime Cleanup", () => {
    it("should clear all variables", () => {
      const tokens: StyleToken[] = [
        { path: ["color", "primary"], value: "#0E5EF7" },
        { path: ["color", "secondary"], value: "#6C757D" },
      ];

      runtime.inject(tokens);
      runtime.clear();

      expect(runtime.getVariable("--color-primary")).toBeUndefined();
      expect(runtime.getVariable("--color-secondary")).toBeUndefined();
    });
  });

  describe("CSS Generation", () => {
    it.skip("should generate CSS string (not implemented)", () => {
      // generateCSS method not implemented yet
    });
  });
});
