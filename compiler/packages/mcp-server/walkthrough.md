# MCP Server Test Walkthrough

I have successfully tested the `@uih-dsl/mcp-server` by creating a custom MCP client script.

## Test Steps
1. **Build**: Ran `pnpm build` to compile the TypeScript source to `dist/`.
2. **Client Script**: Created `test-client.mjs` to interact with the server via Stdio.
3. **Execution**: Ran the script to verify the following:
   - Server initialization (`initialize`)
   - Tool listing (`tools/list`)
   - Tool execution (`tools/call` with `validate_uih`)

## Test Results
The server is functioning correctly.

### Tool Listing
The server exposes the following tools:
- `validate_uih`: Validates UIH DSL code.
- `compile_uih`: Compiles UIH DSL code to React/Vue/Svelte.

### Validation Test
I sent a test request to `validate_uih` with `component Test {}`.
The server responded with validation errors (as expected for incomplete code), confirming the tool logic is active.

```json
{
  "valid": false,
  "errors": [
    {
      "message": "Layout block is required",
      "line": 1,
      "column": 1
    }
  ]
}
```

## How to Run the Test Yourself
You can run the test script again using:
```bash
node test-client.mjs
```
