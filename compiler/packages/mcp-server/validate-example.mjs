import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'dist', 'index.js');
const examplePath = path.join(__dirname, '../../../examples/settings-form.uih');

async function validateAndAdd() {
  const code = await fs.readFile(examplePath, 'utf-8');
  console.log('Starting MCP Server...');
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  const send = (msg) => {
    server.stdin.write(JSON.stringify(msg) + '\n');
  };

  let step = 0;

  server.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim());
    for (const line of lines) {
      try {
        const json = JSON.parse(line);
        
        if (step === 0 && json.id === 1) {
          console.log('Server initialized. Sending validation request...');
          send({ jsonrpc: '2.0', method: 'notifications/initialized' });
          send({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: 'validate_uih',
              arguments: { code: code }
            }
          });
          step++;
        } else if (step === 1 && json.id === 2) {
          const result = json.result;
          const content = JSON.parse(result.content[0].text);
          
          if (content.valid) {
            console.log('✅ Validation successful! The example is valid.');
            process.exit(0);
          } else {
            console.error('❌ Validation failed:', content.errors);
            process.exit(1);
          }
        }
      } catch (e) {
        // Ignore parse errors from non-JSON output
      }
    }
  });

  send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'example-adder', version: '1.0' }
    }
  });
}

validateAndAdd();
