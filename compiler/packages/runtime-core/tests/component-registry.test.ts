/**
 * Tests for UIH Runtime Core - Component Registry
 */

import { describe, it, expect, beforeEach } from "vitest";
import { ComponentRegistry, BUILTIN_COMPONENTS } from "../src/component-registry.js";

describe("ComponentRegistry", () => {
  let registry: ComponentRegistry;

  beforeEach(() => {
    registry = new ComponentRegistry({ strict: false });
  });

  describe("Built-in Components", () => {
    it("should initialize with all built-in components", () => {
      expect(registry.has("Div")).toBe(true);
      expect(registry.has("Button")).toBe(true);
      expect(registry.has("H1")).toBe(true);
      expect(registry.get("Div")).toBe("div");
      expect(registry.get("Button")).toBe("button");
    });

    it("should have 33 built-in components", () => {
      expect(BUILTIN_COMPONENTS.length).toBe(33);
    });

    it("should map UIH names to lowercase HTML tags", () => {
      expect(registry.get("Div")).toBe("div");
      expect(registry.get("Span")).toBe("span");
      expect(registry.get("P")).toBe("p");
    });
  });

  describe("Component Registration", () => {
    it("should register custom components", () => {
      const CustomComponent = () => "custom";
      registry.register("CustomButton", CustomComponent);

      expect(registry.has("CustomButton")).toBe(true);
      expect(registry.get("CustomButton")).toBe(CustomComponent);
    });

    it("should allow overriding built-in components", () => {
      const CustomDiv = () => "custom-div";
      registry.register("Div", CustomDiv);

      expect(registry.get("Div")).toBe(CustomDiv);
    });

    it("should handle multiple registrations", () => {
      registry.register("Comp1", "comp1");
      registry.register("Comp2", "comp2");
      registry.register("Comp3", "comp3");

      expect(registry.has("Comp1")).toBe(true);
      expect(registry.has("Comp2")).toBe(true);
      expect(registry.has("Comp3")).toBe(true);
    });
  });

  describe("Component Retrieval", () => {
    it("should return undefined for non-existent components", () => {
      expect(registry.get("NonExistent")).toBeUndefined();
    });

    it("should check existence with has()", () => {
      expect(registry.has("Div")).toBe(true);
      expect(registry.has("NonExistent")).toBe(false);
    });
  });

  describe("Registry Operations", () => {
    it("should clear custom components but keep built-ins", () => {
      registry.register("CustomButton", "custom");
      registry.clear();

      // Built-ins are still registered
      expect(registry.has("Div")).toBe(true);
      // Custom components are not cleared (clear doesn't remove built-ins)
      expect(registry.has("CustomButton")).toBe(false);
    });

    it("should reinitialize built-ins in new registry", () => {
      const newRegistry = new ComponentRegistry({ strict: false });

      expect(newRegistry.has("Div")).toBe(true);
      expect(newRegistry.has("Button")).toBe(true);
    });
  });

  describe("Strict Mode", () => {
    it("should allow custom components in non-strict mode", () => {
      const nonStrict = new ComponentRegistry({ strict: false });
      expect(() => nonStrict.register("Custom", "custom")).not.toThrow();
    });

    it("should track strict mode setting", () => {
      const strict = new ComponentRegistry({ strict: true });
      const nonStrict = new ComponentRegistry({ strict: false });

      // Both should allow registration (strict mode doesn't prevent it in current implementation)
      expect(() => strict.register("Custom", "custom")).not.toThrow();
      expect(() => nonStrict.register("Custom", "custom")).not.toThrow();
    });
  });
});
