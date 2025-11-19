/**
 * Tests for UIH Runtime Core - Event Mapping
 */

import { describe, it, expect, vi } from "vitest";
import {
  EventMapper,
  EventHandlerRegistry,
  EVENT_NAME_MAP,
} from "../src/event-mapping.js";

describe("EventMapper", () => {
  describe("React Event Mapping", () => {
    it("should map DSL events to React events", () => {
      const mapper = new EventMapper("react");

      expect(mapper.normalize("onclick")).toBe("onClick");
      expect(mapper.normalize("onsubmit")).toBe("onSubmit");
      expect(mapper.normalize("onchange")).toBe("onChange");
      expect(mapper.normalize("onload")).toBe("useEffect");
    });
  });

  describe("Vue Event Mapping", () => {
    it("should map DSL events to Vue events", () => {
      const mapper = new EventMapper("vue");

      expect(mapper.normalize("onclick")).toBe("@click");
      expect(mapper.normalize("onsubmit")).toBe("@submit");
      expect(mapper.normalize("onchange")).toBe("@change");
      expect(mapper.normalize("onload")).toBe("onMounted");
    });
  });

  describe("Svelte Event Mapping", () => {
    it("should map DSL events to Svelte events", () => {
      const mapper = new EventMapper("svelte");

      expect(mapper.normalize("onclick")).toBe("on:click");
      expect(mapper.normalize("onsubmit")).toBe("on:submit");
      expect(mapper.normalize("onchange")).toBe("on:change");
      expect(mapper.normalize("onload")).toBe("onMount");
    });
  });

  describe("Event Name Map", () => {
    it("should have all required events", () => {
      expect(EVENT_NAME_MAP).toHaveProperty("onclick");
      expect(EVENT_NAME_MAP).toHaveProperty("onsubmit");
      expect(EVENT_NAME_MAP).toHaveProperty("onchange");
      expect(EVENT_NAME_MAP).toHaveProperty("oninput");
      expect(EVENT_NAME_MAP).toHaveProperty("onfocus");
      expect(EVENT_NAME_MAP).toHaveProperty("onblur");
      expect(EVENT_NAME_MAP).toHaveProperty("onkeydown");
      expect(EVENT_NAME_MAP).toHaveProperty("onkeyup");
      expect(EVENT_NAME_MAP).toHaveProperty("onmouseenter");
      expect(EVENT_NAME_MAP).toHaveProperty("onmouseleave");
      expect(EVENT_NAME_MAP).toHaveProperty("onload");
    });

    it("should have mappings for all frameworks", () => {
      const event = EVENT_NAME_MAP.onclick;
      expect(event).toHaveProperty("react");
      expect(event).toHaveProperty("vue");
      expect(event).toHaveProperty("svelte");
    });
  });

  describe("Unknown Events", () => {
    it("should return camelCase for unknown events in React", () => {
      const mapper = new EventMapper("react");
      expect(mapper.normalize("oncustom")).toBe("onCustom");
    });
  });
});

describe("EventHandlerRegistry", () => {
  it("should register event handlers", () => {
    const registry = new EventHandlerRegistry();
    const handler = vi.fn();

    registry.register("handleClick", handler);

    expect(registry.has("handleClick")).toBe(true);
  });

  it("should execute registered handlers", () => {
    const registry = new EventHandlerRegistry();
    const handler = vi.fn();

    registry.register("handleClick", handler);
    registry.execute("handleClick", "arg1", "arg2");

    expect(handler).toHaveBeenCalledWith("arg1", "arg2");
  });

  it("should handle async handlers", async () => {
    const registry = new EventHandlerRegistry();
    const asyncHandler = vi.fn(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
      return "done";
    });

    registry.register("handleAsync", asyncHandler);
    await registry.execute("handleAsync");

    expect(asyncHandler).toHaveBeenCalled();
  });

  it("should log error for non-existent handler", () => {
    const registry = new EventHandlerRegistry();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    // Should not throw, just log error and return
    expect(() => registry.execute("nonExistent")).not.toThrow();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("Event handler not found")
    );

    consoleErrorSpy.mockRestore();
  });

  it("should catch and log errors in handlers", () => {
    const registry = new EventHandlerRegistry();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const errorHandler = vi.fn(() => {
      throw new Error("Handler error");
    });

    registry.register("handleError", errorHandler);

    expect(() => registry.execute("handleError")).toThrow("Handler error");
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("should catch and log async errors", async () => {
    const registry = new EventHandlerRegistry();
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const asyncErrorHandler = vi.fn(async () => {
      throw new Error("Async error");
    });

    registry.register("handleAsyncError", asyncErrorHandler);

    await expect(registry.execute("handleAsyncError")).rejects.toThrow("Async error");
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it.skip("should unregister handlers (not implemented)", () => {
    // unregister method not implemented yet
  });

  it("should clear all handlers", () => {
    const registry = new EventHandlerRegistry();

    registry.register("handler1", vi.fn());
    registry.register("handler2", vi.fn());

    registry.clear();

    expect(registry.has("handler1")).toBe(false);
    expect(registry.has("handler2")).toBe(false);
  });
});
