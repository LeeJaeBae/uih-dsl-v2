import { mkdtempSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { describe, expect, it, vi } from "vitest";
import { compileCommand } from "../commands/compile.js";

vi.mock("../core/run-pipeline.js", () => ({
  runPipeline: () => ({ ast: null, ir: null, code: "output", errors: [] }),
}));

vi.mock("../core/load-file.js", () => ({
  loadFile: () => "layout { Div { \"Hello\" } }",
}));

vi.mock("../utils/logger.js", () => ({
  error: vi.fn(),
  info: vi.fn(),
  success: vi.fn(),
}));

const sampleFile = join(process.cwd(), "compiler/packages/cli/src/__tests__/fixtures/sample.uih");

describe("compileCommand", () => {
  it("writes framework-specific extensions", () => {
    const outDir = mkdtempSync(join(tmpdir(), "uih-compile-"));
    const exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);

    compileCommand(sampleFile, { out: outDir, target: "vue" });
    const vueContent = readFileSync(join(outDir, "index.vue"), "utf-8");

    expect(exitSpy).not.toHaveBeenCalled();
    expect(vueContent).toBe("output");

    exitSpy.mockRestore();
  });
});
