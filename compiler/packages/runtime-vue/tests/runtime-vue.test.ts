/**
 * Tests for UIH Runtime Vue
 */

import { describe, it, expect } from "vitest";
import {
  VueComponentRegistry,
  VueEventMapper,
  isComponentRenderError,
  formatVueError,
  VUE_BUILTIN_COMPONENTS,
} from "../src/index.js";

describe("VueComponentRegistry", () => {
  it("should create registry with built-in components", () => {
    const registry = new VueComponentRegistry();

    expect(registry.has("Div")).toBe(true);
    expect(registry.has("Button")).toBe(true);
    expect(registry.get("Div")).toBe("div");
  });

  it("should have Vue built-in components", () => {
    expect(VUE_BUILTIN_COMPONENTS).toHaveProperty("Div");
    expect(VUE_BUILTIN_COMPONENTS).toHaveProperty("Button");
    expect(VUE_BUILTIN_COMPONENTS.Div).toBe("div");
    expect(VUE_BUILTIN_COMPONENTS.Button).toBe("button");
  });

  it("should register Vue components", () => {
    const registry = new VueComponentRegistry();
    const CustomComponent = { name: "Custom" };

    registry.registerVueComponent("Custom", CustomComponent);

    expect(registry.has("Custom")).toBe(true);
    expect(registry.get("Custom")).toBe(CustomComponent);
  });
});

describe("VueEventMapper", () => {
  it("should map DSL events to Vue events", () => {
    const mapper = new VueEventMapper();

    expect(mapper.toVueEventName("onclick")).toBe("@click");
    expect(mapper.toVueEventName("onsubmit")).toBe("@submit");
    expect(mapper.toVueEventName("onchange")).toBe("@change");
  });

  it("should detect lifecycle hooks", () => {
    const mapper = new VueEventMapper();

    expect(mapper.requiresLifecycleHook("onload")).toBe(true);
    expect(mapper.requiresLifecycleHook("onclick")).toBe(false);
  });

  it("should get lifecycle hook name", () => {
    const mapper = new VueEventMapper();

    expect(mapper.getLifecycleHookName("onload")).toBe("onMounted");
    expect(mapper.getLifecycleHookName("onclick")).toBeNull();
  });
});

describe("Vue Error Utilities", () => {
  it("should detect component render errors", () => {
    expect(isComponentRenderError("component render")).toBe(true);
    expect(isComponentRenderError("Failed to resolve component")).toBe(true);
    expect(isComponentRenderError("some error")).toBe(false);
  });

  it("should format Vue errors", () => {
    const error = new Error("Component not found");
    const instance = {
      $options: { name: "TestComponent" },
    } as any;

    const formatted = formatVueError(error, instance, "component render");

    expect(formatted).toBeTruthy();
    expect(formatted?.type).toBe("MISSING_COMPONENT");
    expect(formatted?.message).toContain("Component not found");
    expect(formatted?.componentName).toBe("TestComponent");
  });

  it("should return null for non-Error objects", () => {
    const formatted = formatVueError("not an error" as any, null, "info");

    expect(formatted).toBeNull();
  });
});
