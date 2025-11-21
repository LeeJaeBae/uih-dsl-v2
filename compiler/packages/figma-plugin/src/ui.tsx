import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { generateUIH } from "./ai-client";

function App() {
  const [jsonResult, setJsonResult] = useState<string>("");
  const [uihResult, setUihResult] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"json" | "uih">("uih");

  useEffect(() => {
    // Load API Key from local storage (Note: Figma plugins share local storage per plugin id)
    const storedKey = localStorage.getItem("gemini_api_key");
    if (storedKey) setApiKey(storedKey);

    window.onmessage = async (event) => {
      const { type, data } = event.data.pluginMessage;
      if (type === "selection-json") {
        setJsonResult(JSON.stringify(data, null, 2));
        
        // Auto-generate if key exists
        if (apiKey) {
            await handleGenerate(data);
        } else {
            setActiveTab("json"); // Fallback to JSON view if no key
        }
      }
    };
  }, [apiKey]);

  const saveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem("gemini_api_key", key);
  };

  const handleScan = () => {
    parent.postMessage({ pluginMessage: { type: "create-rect" } }, "*");
  };

  const handleGenerate = async (jsonData: any) => {
    if (!apiKey) {
      alert("Please enter a Google Gemini API Key first.");
      return;
    }
    
    setIsLoading(true);
    setActiveTab("uih");
    try {
      const code = await generateUIH(apiKey, jsonData);
      setUihResult(code);
    } catch (e) {
      setUihResult("// Error generating code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  };

  return (
    <div style={{ padding: "16px", fontFamily: "Inter, sans-serif", color: "#333" }}>
      <h2 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "16px" }}>
        UIH DSL Converter (AI)
      </h2>
      
      {/* API Key Section */}
      <div style={{ marginBottom: "16px", padding: "8px", background: "#F3F4F6", borderRadius: "6px" }}>
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

      <div style={{ marginBottom: "16px" }}>
        <button 
          onClick={handleScan}
          disabled={isLoading}
          style={{
            width: "100%",
            padding: "10px",
            background: apiKey ? "#18A0FB" : "#999",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontWeight: 500,
            cursor: apiKey ? "pointer" : "not-allowed",
            opacity: isLoading ? 0.7 : 1
          }}
        >
          {isLoading ? "Generating..." : "Scan & Convert"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #ddd", marginBottom: "8px" }}>
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
            UIH Code
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
            Raw JSON
        </button>
      </div>

      {/* Content Area */}
      <div style={{ position: "relative" }}>
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
        
        <textarea
            readOnly
            value={activeTab === "uih" ? uihResult : jsonResult}
            placeholder={activeTab === "uih" ? "// AI Generated Code will appear here..." : "// Scanned JSON will appear here..."}
            style={{
              width: "100%",
              height: "320px",
              fontSize: "11px",
              fontFamily: "monospace",
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              background: "#fafafa",
              resize: "vertical",
              whiteSpace: "pre"
            }}
          />
      </div>
    </div>
  );
}

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(<App />);
