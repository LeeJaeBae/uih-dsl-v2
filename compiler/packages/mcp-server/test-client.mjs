import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverPath = path.join(__dirname, 'dist', 'index.js');

console.log(`Starting server at ${serverPath}...`);
const server = spawn('node', [serverPath], {
  stdio: ['pipe', 'pipe', 'inherit']
});

const send = (msg) => {
  const str = JSON.stringify(msg);
  console.log('Client -> Server:', str);
  server.stdin.write(str + '\n');
};

let step = 0;

server.stdout.on('data', (data) => {
  const lines = data.toString().split('\n').filter(line => line.trim());
  for (const line of lines) {
    console.log('Server -> Client:', line);
    try {
      const json = JSON.parse(line);
      
      // Handle initialize response
      if (step === 0 && json.id === 1) {
        console.log('Server initialized!');
        
        // Send initialized notification
        send({
          jsonrpc: '2.0',
          method: 'notifications/initialized'
        });

        // Request tools list
        send({
          jsonrpc: '2.0',
          id: 2,
          method: 'tools/list'
        });
        step++;
      } 
      // Handle tools/list response
      else if (step === 1 && json.id === 2) {
        console.log('Tools listed successfully!');
        console.log(JSON.stringify(json.result, null, 2));
        
        // Test validate_uih tool
        console.log('Testing validate_uih tool...');
        send({
          jsonrpc: '2.0',
          id: 3,
          method: 'tools/call',
          params: {
            name: 'validate_uih',
            arguments: {
              code: 'component Test {}'
            }
          }
        });
        step++;
      }
      // Handle tools/call response
      else if (step === 2 && json.id === 3) {
        console.log('Validation result:', JSON.stringify(json.result, null, 2));
        process.exit(0);
      }
    } catch (e) {
      console.error('Error parsing JSON:', e);
    }
  }
});

// Send initialize
send({
  jsonrpc: '2.0',
  id: 1,
  method: 'initialize',
  params: {
    protocolVersion: '2024-11-05',
    capabilities: {},
    clientInfo: {
      name: 'test-client',
      version: '1.0'
    }
  }
});
