import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { generateUIH } from "./ai-client";
import { Tokenizer } from "@uih-dsl/tokenizer";
import { Parser } from "@uih-dsl/parser";
import { generate } from "@uih-dsl/codegen-react";

const App = () => {
  const [jsonResult, setJsonResult] = useState<string>("");
  const [uihResult, setUihResult] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"json" | "uih" | "preview">("uih");
  const previewRef = useRef<HTMLIFrameElement>(null);

  // --- Handlers ---

  const saveApiKey = useCallback((key: string) => {
    setApiKey(key);
    parent.postMessage({ pluginMessage: { type: "save-api-key", data: key } }, "*");
  }, []);

  const handleScan = useCallback(() => {
    parent.postMessage({ pluginMessage: { type: "create-rect" } }, "*");
  }, []);

  const handleGenerate = useCallback(async (jsonData: any) => {
    if (!apiKey) {
      alert("Please enter a Google Gemini API Key first.");
      return;
    }
    
    setIsLoading(true);
    setActiveTab("uih");
    try {
      const code = await generateUIH(apiKey, jsonData);
      setUihResult(code);
      if (!code.startsWith("// Error")) {
          setActiveTab("preview");
      }
    } catch (e: any) {
      setUihResult(`// Error generating code:\n${e.message}`);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleCopy = useCallback((text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }, []);

  // --- Effects ---

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      const { type, data } = event.data.pluginMessage;
      
      if (type === "load-api-key") {
        setApiKey(data);
      }
      
      if (type === "selection-json") {
        setJsonResult(JSON.stringify(data, null, 2));
        setActiveTab("json");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [apiKey, handleGenerate]);

  useEffect(() => {
    if (activeTab === "preview" && uihResult && !uihResult.startsWith("// Error") && previewRef.current) {
      try {
        const tokens = new Tokenizer(uihResult).tokenize();
        const parser = new Parser(tokens);
        const { ast, errors } = parser.parseFile();
        
        if (!ast) {
            throw new Error(errors.map(e => e.message).join("\n"));
        }
        
        // Generate React Code
        const { code: reactCode } = generate(ast, { componentName: "GeneratedComponent" });
        
        const bodyCode = reactCode
            .replace(/import .*?;/g, "")
            .replace(/export default function GeneratedComponent/, "function GeneratedComponent");

        const html = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { margin: 0; padding: 0; font-family: sans-serif; }
                * { box-sizing: border-box; }
              </style>
              <script type="importmap">
                {
                  "imports": {
                    "react": "https://esm.sh/react@18.2.0",
                    "react-dom/client": "https://esm.sh/react-dom@18.2.0/client"
                  }
                }
              </script>
            </head>
            <body>
              <div id="root"></div>
              <script type="module">
                import React from "react";
                import { createRoot } from "react-dom/client";

                const Header = (props) => React.createElement("header", props);
                const Section = (props) => React.createElement("section", props);
                const Div = (props) => React.createElement("div", props);
                const P = (props) => React.createElement("p", props);
                const H1 = (props) => React.createElement("h1", props);
                const Button = (props) => React.createElement("button", props);
                const Img = (props) => React.createElement("img", props);
                
                const ComponentProxy = new Proxy({}, {
                    get: (target, prop) => (props) => React.createElement("div", { ...props, "data-component": prop }, props.children)
                });

                ${bodyCode}

                const root = createRoot(document.getElementById("root"));
                root.render(React.createElement(GeneratedComponent));
              </script>
            </body>
          </html>
        `;
        
        previewRef.current.srcdoc = html;
      } catch (e) {
        console.error("Compilation Error:", e);
      }
    }
  }, [uihResult, activeTab]);

  return (
    <div style={{ padding: "16px", fontFamily: "Inter, sans-serif", color: "#333", height: "100%", display: "flex", flexDirection: "column" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px", flexShrink: 0 }}>
        UIH DSL Converter (AI)
      </h2>
      
      <div style={{ marginBottom: "16px", padding: "8px", background: "#F3F4F6", borderRadius: "6px", flexShrink: 0 }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 600, marginBottom: "4px" }}>
            Gemini API Key
        </label>
        <input 
            type="password" 
            value={apiKey}
            onChange={(e) => saveApiKey(e.target.value)}
            placeholder="Enter API Key..."
            style={{ width: "100%", padding: "6px", border: "1px solid #ddd", borderRadius: "4px" }}
        />
      </div>

      <div style={{ marginBottom: "16px", flexShrink: 0, display: "flex", gap: "8px" }}>
        <button 
          onClick={handleScan}
          style={{
            flex: 1,
            padding: "10px",
            background: "#fff",
            color: "#333",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          Scan JSON
        </button>
        <button 
          onClick={() => {
             // Trigger scan first if no JSON, but ideally we assume JSON is scanned or we trigger scan then AI
             // For simplicity, let's make handleScan just scan, and we add a separate AI trigger if JSON exists
             // Or better: handleScan does extraction. We need a new function to trigger AI from existing JSON.
             if (jsonResult) {
                 handleGenerate(JSON.parse(jsonResult));
             } else {
                 // If no JSON, scan and then generate (requires modifying handleScan or message flow)
                 // For data collection, 'Scan JSON' is primary.
                 alert("Please Scan JSON first.");
             }
          }}
          disabled={isLoading || !jsonResult}
          style={{
            flex: 1,
            padding: "10px",
            background: apiKey && jsonResult ? "#18A0FB" : "#999",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: apiKey && jsonResult ? "pointer" : "not-allowed",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? "Generating..." : "Convert AI"}
        </button>
      </div>

      <div style={{ display: "flex", borderBottom: "1px solid #ddd", marginBottom: "8px", flexShrink: 0 }}>
        <button 
            onClick={() => setActiveTab("preview")}
            style={{ 
                padding: "6px 12px", 
                border: "none", 
                background: "none", 
                borderBottom: activeTab === "preview" ? "2px solid #18A0FB" : "none",
                fontWeight: activeTab === "preview" ? 600 : 400,
                cursor: "pointer"
            }}
        >
            Preview
        </button>
        <button 
            onClick={() => setActiveTab("uih")}
            style={{ 
                padding: "6px 12px", 
                border: "none", 
                background: "none", 
                borderBottom: activeTab === "uih" ? "2px solid #18A0FB" : "none",
                fontWeight: activeTab === "uih" ? 600 : 400,
                cursor: "pointer"
            }}
        >
            Code
        </button>
        <button 
            onClick={() => setActiveTab("json")}
            style={{ 
                padding: "6px 12px", 
                border: "none", 
                background: "none", 
                borderBottom: activeTab === "json" ? "2px solid #18A0FB" : "none",
                fontWeight: activeTab === "json" ? 600 : 400,
                cursor: "pointer"
            }}
        >
            JSON
        </button>
      </div>

      <div style={{ position: "relative", flexGrow: 1, minHeight: "300px", border: "1px solid #ddd", borderRadius: "4px", overflow: "hidden" }}>
         {activeTab !== "preview" && (
             <button 
                onClick={() => handleCopy(activeTab === "uih" ? uihResult : jsonResult)}
                style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    fontSize: "11px",
                    padding: "4px 8px",
                    background: "white",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    cursor: "pointer",
                    zIndex: 10
                }}
            >
                Copy
            </button>
         )}
        
        {activeTab === "preview" ? (
            <iframe 
                ref={previewRef}
                style={{ width: "100%", height: "100%", border: "none" }}
                title="Preview"
            />
        ) : (
            <textarea
                readOnly
                value={activeTab === "uih" ? uihResult : jsonResult}
                placeholder={activeTab === "uih" ? "// AI Generated Code will appear here..." : "// Scanned JSON will appear here..."}
                style={{
                  width: "100%",
                  height: "100%",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  padding: "8px",
                  border: "none",
                  background: "#fafafa",
                  resize: "none",
                  whiteSpace: "pre"
                }}
              />
        )}
      </div>
    </div>
  );
};

const container = document.getElementById("root");
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}