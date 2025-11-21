import { useMemo, useState, useEffect } from "react";
import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import { generate as generateReact } from "@uih-dsl/codegen-react";
import { generate as generateVue } from "@uih-dsl/codegen-vue";
import { generate as generateSvelte } from "@uih-dsl/codegen-svelte";
import type { CompileResult, Framework } from "../types";

interface WebSocketMessage {
  type: "success" | "error" | "fatal-error";
  code?: string;
  ir?: any;
  errors?: Array<{ message: string; line?: number; column?: number }>;
  timestamp: number;
  target?: string;
}

export function useCompiler(dsl: string, framework: Framework): CompileResult & {
  wsStatus: "connected" | "disconnected" | "connecting";
  wsEnabled: boolean;
} {
  const [liveCode, setLiveCode] = useState<string | null>(null);
  const [wsStatus, setWsStatus] = useState<"connected" | "disconnected" | "connecting">("disconnected");
  const [wsEnabled, setWsEnabled] = useState(false);

  // WebSocket connection for live preview
  useEffect(() => {
    // Check if WebSocket server is available
    const wsUrl = "ws://localhost:3001";
    let ws: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      setWsStatus("connecting");
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setWsStatus("connected");
        setWsEnabled(true);
        console.log("✅ Connected to UIH dev server");
      };

      ws.onmessage = (event) => {
        try {
          const data: WebSocketMessage = JSON.parse(event.data);

          if (data.type === "success" && data.code) {
            setLiveCode(data.code);
          } else if (data.type === "error") {
            // Errors are handled by normal compilation
            setLiveCode(null);
          }
        } catch (error) {
          console.error("Failed to parse WebSocket message:", error);
        }
      };

      ws.onerror = () => {
        setWsStatus("disconnected");
        setWsEnabled(false);
      };

      ws.onclose = () => {
        setWsStatus("disconnected");
        setWsEnabled(false);

        // Attempt to reconnect after 3 seconds
        reconnectTimeout = setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      if (ws) {
        ws.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, []);

  // Use live code if available from WebSocket, otherwise compile manually
  const result = useMemo(() => {
    // If we have live code from WebSocket, use it directly
    if (wsEnabled && liveCode) {
      return {
        ast: null,
        ir: null,
        code: liveCode,
        errors: [],
      };
    }

    // Otherwise, compile locally as before
    const localResult: CompileResult = {
      ast: null,
      ir: null,
      code: "",
      errors: [],
    };

    try {
      const tokens = tokenize(dsl);
      const parseResult = parse(tokens);

      if (parseResult.errors.length > 0) {
        localResult.errors = parseResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        }));
        return localResult;
      }

      if (!parseResult.ast) {
        localResult.errors = [{ message: "Failed to parse UIH code", line: 1, column: 1 }];
        return localResult;
      }

      localResult.ast = parseResult.ast;

      const irResult = createIR(parseResult.ast, parseResult.errors);

      if (irResult.errors.length > 0) {
        localResult.errors = irResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        }));
        return localResult;
      }

      localResult.ir = irResult;

      let codeResult;
      switch (framework) {
        case "vue":
          codeResult = generateVue(irResult);
          break;
        case "svelte":
          codeResult = generateSvelte(irResult);
          break;
        case "html":
          localResult.errors.push({
            message: "HTML generation is not currently supported.",
            line: 1,
            column: 1,
          });
          codeResult = { code: "// HTML generation not supported." }; // Provide a placeholder
          break;
        case "react":
        default:
          codeResult = generateReact(irResult);
          break;
      }

      localResult.code = codeResult.code;
    } catch (error: any) {
      localResult.errors = [{ message: `Compilation failed: ${error.message}`, line: 1, column: 1 }];
    }

    return localResult;
  }, [dsl, framework, wsEnabled, liveCode]);

  return {
    ...result,
    wsStatus,
    wsEnabled,
  };
}
