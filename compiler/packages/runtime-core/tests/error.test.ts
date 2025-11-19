/**
 * Tests for UIH Runtime Core - Error Handling
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createMissingComponentError,
  createEventHandlerError,
  createHydrationMismatchError,
  UIHErrorHandler,
} from "../src/error.js";

describe("Error Factory Functions", () => {
  it("should create missing component error", () => {
    const error = createMissingComponentError("Button");

    expect(error.type).toBe("MISSING_COMPONENT");
    expect(error.message).toContain("Button");
    expect(error.message).toContain("not registered");
    expect(error.componentName).toBe("Button");
  });

  it("should create event handler error", () => {
    const originalError = new Error("Something went wrong");
    const error = createEventHandlerError("handleClick", originalError);

    expect(error.type).toBe("EVENT_HANDLER_ERROR");
    expect(error.message).toContain("handleClick");
    expect(error.handlerName).toBe("handleClick");
  });

  it("should create hydration mismatch error", () => {
    const error = createHydrationMismatchError("<div>server</div>", "<div>client</div>");

    expect(error.type).toBe("HYDRATION_MISMATCH");
    expect(error.message).toContain("mismatch");
  });
});

describe("UIHErrorHandler", () => {
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("should handle errors and log to console", () => {
    const handler = new UIHErrorHandler();
    const error = createMissingComponentError("Button");

    handler.handle(error);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      expect.stringContaining("[UIH Runtime Error] MISSING_COMPONENT:"),
      expect.stringContaining("Button")
    );
  });

  it("should call custom error callback", () => {
    const onError = vi.fn();
    const handler = new UIHErrorHandler(onError);
    const error = createMissingComponentError("Button");

    handler.handle(error);

    expect(onError).toHaveBeenCalledWith(error);
  });

  it("should handle errors without callback", () => {
    const handler = new UIHErrorHandler();
    const error = createMissingComponentError("Button");

    expect(() => handler.handle(error)).not.toThrow();
  });
});
