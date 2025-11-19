/**
 * Tests for UIH Runtime React
 */

import { describe, it, expect } from "vitest";
import {
  ReactComponentRegistry,
  ReactEventMapper,
  isMissingComponentError,
  formatRuntimeError,
} from "../src/index.js";

describe("ReactComponentRegistry", () => {
  it("should create registry with built-in components", () => {
    const registry = new ReactComponentRegistry();

    expect(registry.has("Div")).toBe(true);
    expect(registry.has("Button")).toBe(true);
    expect(registry.get("Div")).toBe("div");
  });

  it("should register React components", () => {
    const registry = new ReactComponentRegistry();
    const CustomComponent = () => null;

    registry.registerReactComponent("Custom", CustomComponent);

    expect(registry.has("Custom")).toBe(true);
    expect(registry.get("Custom")).toBe(CustomComponent);
  });
});

describe("ReactEventMapper", () => {
  it("should map DSL events to React events", () => {
    const mapper = new ReactEventMapper();

    expect(mapper.toReactEventName("onclick")).toBe("onClick");
    expect(mapper.toReactEventName("onsubmit")).toBe("onSubmit");
    expect(mapper.toReactEventName("onchange")).toBe("onChange");
  });

  it("should detect lifecycle hooks", () => {
    const mapper = new ReactEventMapper();

    expect(mapper.requiresLifecycleHook("onload")).toBe(true);
    expect(mapper.requiresLifecycleHook("onclick")).toBe(false);
  });

  it.skip("should get lifecycle hook name (not implemented as method)", () => {
    // ReactEventMapper doesn't expose getLifecycleHookName as a method
    // Lifecycle handling is done through toReactEventName
  });
});

describe("Error Utilities", () => {
  it("should detect missing component errors", () => {
    const error1 = new Error("Element type is invalid");
    const error2 = new Error("not found in registry");
    const error3 = new Error("Some other error");

    expect(isMissingComponentError(error1)).toBe(true);
    expect(isMissingComponentError(error2)).toBe(true);
    expect(isMissingComponentError(error3)).toBe(false);
  });

  it("should format runtime errors", () => {
    const error = {
      type: "MISSING_COMPONENT" as const,
      message: "Button not found",
      componentName: "Button",
      handlerName: "handleClick",
      line: 10,
      column: 5,
    };

    const formatted = formatRuntimeError(error);

    expect(formatted).toContain("MISSING_COMPONENT");
    expect(formatted).toContain("Button not found");
    expect(formatted).toContain("Component: Button");
    expect(formatted).toContain("Handler: handleClick");
    expect(formatted).toContain("line 10, column 5");
  });
});
