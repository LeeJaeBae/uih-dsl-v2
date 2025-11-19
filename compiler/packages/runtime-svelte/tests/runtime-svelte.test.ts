/**
 * Tests for UIH Runtime Svelte
 */

import { describe, it, expect } from "vitest";
import {
  SvelteComponentRegistry,
  SvelteEventMapper,
  isHydrationFailure,
  formatSvelteError,
  SVELTE_BUILTIN_COMPONENTS,
} from "../src/index.js";

describe("SvelteComponentRegistry", () => {
  it("should create registry with built-in components", () => {
    const registry = new SvelteComponentRegistry();

    expect(registry.has("Div")).toBe(true);
    expect(registry.has("Button")).toBe(true);
    expect(registry.get("Div")).toBe("div");
  });

  it("should have Svelte built-in components", () => {
    expect(SVELTE_BUILTIN_COMPONENTS).toHaveProperty("Div");
    expect(SVELTE_BUILTIN_COMPONENTS).toHaveProperty("Button");
    expect(SVELTE_BUILTIN_COMPONENTS.Div).toBe("div");
    expect(SVELTE_BUILTIN_COMPONENTS.Button).toBe("button");
  });

  it("should register Svelte components", () => {
    const registry = new SvelteComponentRegistry();
    const CustomComponent = class {};

    registry.registerSvelteComponent("Custom", CustomComponent);

    expect(registry.has("Custom")).toBe(true);
    expect(registry.get("Custom")).toBe(CustomComponent);
  });
});

describe("SvelteEventMapper", () => {
  it("should map DSL events to Svelte events", () => {
    const mapper = new SvelteEventMapper();

    expect(mapper.toSvelteEventName("onclick")).toBe("on:click");
    expect(mapper.toSvelteEventName("onsubmit")).toBe("on:submit");
    expect(mapper.toSvelteEventName("onchange")).toBe("on:change");
  });

  it("should detect lifecycle hooks", () => {
    const mapper = new SvelteEventMapper();

    expect(mapper.requiresLifecycleHook("onload")).toBe(true);
    expect(mapper.requiresLifecycleHook("onclick")).toBe(false);
  });

  it("should get lifecycle hook name", () => {
    const mapper = new SvelteEventMapper();

    expect(mapper.getLifecycleHookName("onload")).toBe("onMount");
    expect(mapper.getLifecycleHookName("onclick")).toBeNull();
  });
});

describe("Svelte Error Utilities", () => {
  it("should detect hydration failures", () => {
    const hydrationError = new Error("Hydration failed");
    const mismatchError = new Error("Server and client mismatch");
    const normalError = new Error("Some other error");

    expect(isHydrationFailure(hydrationError)).toBe(true);
    expect(isHydrationFailure(mismatchError)).toBe(true);
    expect(isHydrationFailure(normalError)).toBe(false);
  });

  it("should format Svelte errors", () => {
    const hydrationError = new Error("Hydration mismatch detected");
    const formatted = formatSvelteError(hydrationError, "TestComponent");

    expect(formatted).toBeTruthy();
    expect(formatted?.type).toBe("HYDRATION_MISMATCH");
    expect(formatted?.message).toContain("Hydration");
    expect(formatted?.componentName).toBe("TestComponent");
  });

  it("should return null for non-Error objects", () => {
    const formatted = formatSvelteError("not an error" as any);

    expect(formatted).toBeNull();
  });
});
