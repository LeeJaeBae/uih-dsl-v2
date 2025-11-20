"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useCompiler } from "../hooks/useCompiler";
import { IframePreview } from "../components/IframePreview";
import type { Framework } from "../types";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

const DEFAULT_UIH = `meta {
  title: "UIH Playground"
  route: "/"
}

style {
  color.primary: "#0E5EF7"
  color.secondary: "#8B5CF6"
}

layout {
  Div(class:"min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8") {
    Div(class:"max-w-4xl mx-auto") {
      H1(class:"text-4xl font-bold text-gray-900 mb-4") {
        "UIH DSL Playground"
      }
      P(class:"text-lg text-gray-600 mb-8") {
        "Try editing the UIH code on the left and see the live preview!"
      }
      Div(class:"bg-white p-6 rounded-lg shadow-lg") {
        H2(class:"text-2xl font-semibold mb-4") {
          "Hello World"
        }
        P(class:"text-gray-700") {
          "This is compiled from UIH DSL and rendered in real-time."
        }
      }
    }
  }
}`;

export default function Playground() {
  const [uihCode, setUihCode] = useState(DEFAULT_UIH);
  const [framework, setFramework] = useState<Framework>("react");

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
        <div className="w-1/2 border-r border-gray-700">
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
            <span className="text-gray-400 text-sm font-medium">UIH Code</span>
          </div>
          <Editor
            height="calc(100vh - 96px)"
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

        <div className="w-1/2 flex flex-col">
          <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
            <span className="text-gray-400 text-sm font-medium">
              Generated {framework.charAt(0).toUpperCase() + framework.slice(1)} Code
            </span>
          </div>

          <div className="flex-1 overflow-hidden">
            {errors.length > 0 ? (
              <div className="h-full bg-red-950 p-4 overflow-auto">
                <div className="text-red-400 font-mono text-sm">
                  {errors.map((error, i) => (
                    <div key={i} className="mb-2">
                      <strong>Line {error.line}:{error.column}</strong> - {error.message}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col">
                <div className="h-1/2 border-b border-gray-700">
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
                <div className="h-1/2 bg-white">
                  <div className="h-10 bg-gray-800 border-b border-gray-700 flex items-center px-4">
                    <span className="text-gray-400 text-sm font-medium">Live Preview</span>
                  </div>
                  <div className="h-[calc(100%-40px)]">
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
