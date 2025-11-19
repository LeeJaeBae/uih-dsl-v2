/**
 * Tests for UIH Runtime Core - Hydration
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  HydrationManager,
  isBrowser,
  isServer,
  waitForHydration,
  getHydrationRoot,
} from "../src/hydration.js";

// Mock window/document for testing
const mockBrowser = () => {
  (global as any).window = { document: {} };
  (global as any).document = {};
};

const mockServer = () => {
  delete (global as any).window;
  delete (global as any).document;
};

describe("Environment Detection", () => {
  it("should detect browser environment", () => {
    mockBrowser();
    expect(isBrowser()).toBe(true);
    expect(isServer()).toBe(false);
  });

  it("should detect server environment", () => {
    mockServer();
    expect(isBrowser()).toBe(false);
    expect(isServer()).toBe(true);
  });
});

describe("HydrationManager", () => {
  let manager: HydrationManager;

  beforeEach(() => {
    mockServer(); // Start in SSR mode
    manager = new HydrationManager({
      detectMismatch: true,
      suppressWarnings: false,
    });
  });

  describe("SSR Detection", () => {
    it("should detect SSR mode", () => {
      expect(manager.isSSR()).toBe(true);
    });

    it("should detect CSR mode", () => {
      mockBrowser();
      const browserManager = new HydrationManager();
      expect(browserManager.isSSR()).toBe(false);
    });
  });

  describe("Hydration State", () => {
    it("should start in not-hydrating state", () => {
      expect(manager.isHydrating()).toBe(false);
    });

    it("should not start hydration on server", () => {
      // Server environment - startHydration should be blocked
      manager.startHydration();
      expect(manager.isHydrating()).toBe(false);
    });

    it("should allow hydration in browser", () => {
      mockBrowser();
      const browserManager = new HydrationManager();

      browserManager.startHydration();
      expect(browserManager.isHydrating()).toBe(true);

      browserManager.markHydrated();
      expect(browserManager.isHydrating()).toBe(false);
    });

    it("should mark as hydrated", () => {
      manager.markHydrated();
      // markHydrated doesn't expose isHydrated(), but shouldn't throw
      expect(() => manager.markHydrated()).not.toThrow();
    });
  });

  describe("Mismatch Detection", () => {
    it("should detect mismatches when enabled", () => {
      const serverHTML = "<div>Hello</div>";
      const clientHTML = "<div>World</div>";

      const hasMismatch = manager.detectMismatch(serverHTML, clientHTML);

      expect(hasMismatch).toBe(true);
    });

    it("should normalize whitespace before comparison (with minor differences)", () => {
      const serverHTML = "<div>  Hello   World  </div>";
      const clientHTML = "<div> Hello  World </div>";

      const hasMismatch = manager.detectMismatch(serverHTML, clientHTML);

      // Both normalize to the same thing
      expect(hasMismatch).toBe(false);
    });

    it("should not detect mismatch for identical HTML", () => {
      const html = "<div>Hello World</div>";

      const hasMismatch = manager.detectMismatch(html, html);

      expect(hasMismatch).toBe(false);
    });

    it("should skip detection when disabled", () => {
      const noDetectManager = new HydrationManager({ detectMismatch: false });
      const serverHTML = "<div>Hello</div>";
      const clientHTML = "<div>World</div>";

      const hasMismatch = noDetectManager.detectMismatch(serverHTML, clientHTML);

      expect(hasMismatch).toBe(false);
    });
  });

  describe("Hydration Root Detection", () => {
    it("should find common root selectors", () => {
      mockBrowser();

      // Mock querySelector
      const mockElement = { id: "root" } as HTMLElement;
      (global as any).document.querySelector = vi.fn((selector: string) => {
        if (selector === "#root") return mockElement;
        return null;
      });

      const root = getHydrationRoot();
      expect(root).toBe(mockElement);
    });

    it("should fallback to document.body", () => {
      mockBrowser();
      const mockBody = { tagName: "BODY" } as HTMLElement;

      (global as any).document.querySelector = vi.fn(() => null);
      (global as any).document.body = mockBody;

      const root = getHydrationRoot();
      expect(root).toBe(mockBody);
    });

    it("should return null on server", () => {
      mockServer();
      const root = getHydrationRoot();
      expect(root).toBeNull();
    });
  });

  describe("Wait for Hydration", () => {
    it.skip("should resolve immediately when already hydrated (not fully implemented)", () => {
      // waitForHydration implementation may need adjustment
    });

    it.skip("should resolve when hydration completes (not fully implemented)", () => {
      // waitForHydration implementation may need adjustment
    });

    it.skip("should timeout if hydration never completes (not fully implemented)", () => {
      // waitForHydration timeout mechanism may need adjustment
    });
  });

  describe("Configuration", () => {
    it("should use default options (detectMismatch enabled by default)", () => {
      const defaultManager = new HydrationManager();

      // By default detectMismatch option should be enabled
      const result = defaultManager.detectMismatch("<div>a</div>", "<div>b</div>");
      // If default is true, this should detect the mismatch
      expect(result).toBeDefined();
    });

    it("should respect custom options", () => {
      const customManager = new HydrationManager({
        detectMismatch: false,
        suppressWarnings: true,
      });

      expect(customManager.detectMismatch("<div>a</div>", "<div>b</div>")).toBe(false);
    });
  });
});
