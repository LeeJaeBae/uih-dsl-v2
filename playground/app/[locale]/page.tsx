"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useCompiler } from "../hooks/useCompiler";
import { IframePreview } from "../components/IframePreview";
import type { Framework } from "../types";

import { EXAMPLES } from "../examples";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

export default function Playground() {
  const [uihCode, setUihCode] = useState(EXAMPLES["Hello World"]);
  const [framework, setFramework] = useState<Framework>("react");
  const [viewMode, setViewMode] = useState<"split" | "code" | "preview">("split");

  const { ast, ir, code, errors } = useCompiler(uihCode, framework);

  const cssVars = useMemo(() => {
    if (!ir?.style?.tokens) return {};
    const vars: Record<string, string> = {};
    ir.style.tokens.forEach((token: any) => {
      const key = token.path.join(".");
      vars[key] = String(token.value);
    });
    return vars;
  }, [ir]);

  const editorMarkers = useMemo(() => {
    return errors.map((error) => ({
      startLineNumber: error.line,
      startColumn: error.column,
      endLineNumber: error.line,
      endColumn: error.column + 10,
      message: error.message,
      severity: 8,
    }));
  }, [errors]);

  return (
    <div className="flex h-screen bg-gray-900 pt-14">
      <div className="absolute top-14 right-4 flex gap-2 z-10">
        <div className="flex bg-gray-800 rounded p-1 mr-4 border border-gray-700">
          <button
            onClick={() => setViewMode("code")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === "code"
                ? "bg-gray-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setViewMode("split")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === "split"
                ? "bg-gray-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-gray-600 text-white"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            Preview
          </button>
        </div>

        <button
          onClick={() => setFramework("react")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            framework === "react"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          React
        </button>
        <button
          onClick={() => setFramework("vue")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            framework === "vue"
              ? "bg-green-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Vue
        </button>
        <button
          onClick={() => setFramework("svelte")}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            framework === "svelte"
              ? "bg-orange-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Svelte
        </button>
      </div>

      <div className="flex flex-1">
        <div className="w-1/2 border-r border-gray-700 flex flex-col">
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4 shrink-0">
            <span className="text-gray-400 text-sm font-medium">UIH Code</span>
            <select
              className="bg-gray-700 text-gray-300 text-sm rounded px-2 py-1 border border-gray-600 focus:outline-none focus:border-blue-500"
              onChange={(e) => setUihCode(EXAMPLES[e.target.value])}
              defaultValue="Hello World"
            >
              {Object.keys(EXAMPLES).map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1 relative">
            <Editor
              height="100%"
              defaultLanguage="plaintext"
              theme="vs-dark"
              value={uihCode}
              onChange={(value) => value && setUihCode(value)}
              onMount={(editor, monaco) => {
                const model = editor.getModel();
                if (model) {
                  monaco.editor.setModelMarkers(model, "uih", editorMarkers);
                }
              }}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                renderLineHighlight: "all",
                cursorBlinking: "smooth",
                smoothScrolling: true,
              }}
            />
          </div>
        </div>

        <div className="w-1/2 flex flex-col relative">
          {/* Error Overlay */}
          {errors.length > 0 && (
            <div className="absolute inset-0 z-20 bg-red-950/90 p-4 overflow-auto backdrop-blur-sm">
              <h3 className="text-red-400 font-bold mb-2">Compilation Errors</h3>
              <div className="text-red-300 font-mono text-sm">
                {errors.map((error, i) => (
                  <div key={i} className="mb-2 border-l-2 border-red-500 pl-2">
                    <strong>
                      Line {error.line}:{error.column}
                    </strong>{" "}
                    - {error.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 flex flex-col h-full overflow-hidden">
            {/* Code View */}
            <div
              className={`flex flex-col ${viewMode === "split" ? "h-1/2 border-b border-gray-700" : viewMode === "code" ? "h-full" : "hidden"}`}
            >
              <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 shrink-0">
                <span className="text-gray-400 text-sm font-medium">
                  Generated {framework.charAt(0).toUpperCase() + framework.slice(1)} Code
                </span>
              </div>
              <div className="flex-1">
                <Editor
                  height="100%"
                  defaultLanguage={framework === "vue" ? "html" : "javascript"}
                  theme="vs-dark"
                  value={code}
                  options={{
                    readOnly: true,
                    minimap: { enabled: false },
                    fontSize: 14,
                    fontFamily: "'JetBrains Mono', 'Fira Code', Consolas, monospace",
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on",
                    renderLineHighlight: "all",
                    smoothScrolling: true,
                  }}
                />
              </div>
            </div>

            {/* Preview View */}
            <div
              className={`flex flex-col bg-white ${viewMode === "split" ? "h-1/2" : viewMode === "preview" ? "h-full" : "hidden"}`}
            >
              <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4 shrink-0">
                <span className="text-gray-400 text-sm font-medium">Live Preview</span>
              </div>
              <div className="flex-1 relative">
                {code ? (
                  <IframePreview code={code} cssVars={cssVars} framework={framework} />
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
                    Compiling...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}