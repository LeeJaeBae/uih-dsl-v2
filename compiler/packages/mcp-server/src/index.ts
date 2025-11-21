import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { validateTool } from "./tools/validate.js";
import { compileTool } from "./tools/compile.js";
import { docsResources } from "./resources/docs.js";

// Create server instance
const server = new McpServer({
  name: "uih-mcp-server",
  version: "1.0.0",
});

// Register tools
server.tool(
  validateTool.name,
  validateTool.description,
  validateTool.inputSchema.shape,
  async (args) => {
    const result = await validateTool.handler(args);
    return {
      content: result.content.map(c => ({ type: "text" as const, text: c.text })),
      isError: (result as any).isError
    };
  }
);

server.tool(
  compileTool.name,
  compileTool.description,
  compileTool.inputSchema.shape,
  async (args) => {
    const result = await compileTool.handler(args);
    return {
      content: result.content.map(c => ({ type: "text" as const, text: c.text })),
      isError: (result as any).isError
    };
  }
);

// Register resources
for (const resource of docsResources) {
  server.resource(
    resource.name,
    resource.uri,
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: resource.content,
          mimeType: resource.mimeType,
        },
      ],
    })
  );
}

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("UIH MCP Server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
