import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@uih-dsl/codegen-react", () => ({
  generate: vi.fn(() => ({ code: "react-out", style: null, meta: null, events: [] })),
}), { virtual: true });

vi.mock("@uih-dsl/codegen-vue", () => ({
  generate: vi.fn(() => ({ code: "vue-out", style: null, meta: null, events: [] })),
}), { virtual: true });

vi.mock("@uih-dsl/codegen-svelte", () => ({
  generate: vi.fn(() => ({ code: "svelte-out", style: null, meta: null, events: [] })),
}), { virtual: true });

import { runPipeline } from "../core/run-pipeline.js";

const source = `layout { Div { "Hello" } }`;

describe("runPipeline target selection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses React generator by default", () => {
    const result = runPipeline(source);

    expect(result.code).toBe("react-out");
    expect(result.errors).toHaveLength(0);
  });

  it("switches to Vue generator when requested", () => {
    const result = runPipeline(source, "vue");

    expect(result.code).toBe("vue-out");
    expect(result.errors).toHaveLength(0);
  });

  it("switches to Svelte generator when requested", () => {
    const result = runPipeline(source, "svelte");

    expect(result.code).toBe("svelte-out");
    expect(result.errors).toHaveLength(0);
  });
});
