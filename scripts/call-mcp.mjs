import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// MCP 서버 경로 (프로젝트 구조에 맞게 조정)
const serverPath = path.resolve(__dirname, '../compiler/packages/mcp-server/dist/index.js');

// 명령행 인자 처리
const args = process.argv.slice(2);
if (args.length < 2) {
  console.error('Usage: node call-mcp.mjs <command> <file_path> [target]');
  console.error('Commands: validate, compile');
  process.exit(1);
}

const command = args[0];
const filePath = args[1];
const target = args[2]; // compile 명령일 때만 사용 (react, vue, svelte)

async function main() {
  // 파일 읽기
  let code;
  try {
    code = await fs.readFile(filePath, 'utf-8');
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error.message);
    process.exit(1);
  }

  // 서버 프로세스 시작
  const server = spawn('node', [serverPath], {
    stdio: ['pipe', 'pipe', 'inherit']
  });

  const send = (msg) => {
    server.stdin.write(JSON.stringify(msg) + '\n');
  };

  let step = 0; // 0: init, 1: tool call
  let buffer = '';

  server.stdout.on('data', (data) => {
    buffer += data.toString();
    
    // Process complete lines only
    let lineEndIndex;
    while ((lineEndIndex = buffer.indexOf('\n')) !== -1) {
      const line = buffer.slice(0, lineEndIndex).trim();
      buffer = buffer.slice(lineEndIndex + 1);

      if (!line) continue;

      try {
        const json = JSON.parse(line);
        
        // 1. 초기화 응답 수신
        if (step === 0 && json.id === 1) {
          // ... (init logic) ...
          send({ jsonrpc: '2.0', method: 'notifications/initialized' });
          
          // 툴 호출 준비
          let toolName = '';
          let toolArgs = {};

          if (command === 'validate') {
            toolName = 'validate_uih';
            toolArgs = { code };
          } else if (command === 'compile') {
            if (!['react', 'vue', 'svelte'].includes(target)) {
                console.error(`Invalid target: ${target}. Must be react, vue, or svelte.`);
                process.exit(1);
            }
            toolName = 'compile_uih';
            toolArgs = { code, target };
          } else {
            console.error(`Unknown command: ${command}`);
            process.exit(1);
          }

          // 툴 실행 요청
          send({
            jsonrpc: '2.0',
            id: 2,
            method: 'tools/call',
            params: {
              name: toolName,
              arguments: toolArgs
            }
          });
          step++;
        } 
        // 2. 툴 실행 결과 수신
        else if (step === 1 && json.id === 2) {
          const result = json.result;
          
          // 결과가 에러인지 확인
          if (result.isError) {
             console.error('MCP Tool Execution Failed:');
          }

          // 결과 텍스트 파싱 및 출력
          if (result.content && result.content.length > 0) {
            const textContent = result.content[0].text;
            try {
                // JSON 결과면 예쁘게 출력
                const parsed = JSON.parse(textContent);
                console.log(JSON.stringify(parsed, null, 2));
            } catch {
                // 일반 텍스트면 그대로 출력
                console.log(textContent);
            }
          }
          
          process.exit(0);
        }
      } catch (e) {
        // Log error only if it's not a partial JSON (which shouldn't happen with buffer logic, but just in case)
        // console.error('Error parsing JSON line:', e.message);
        // console.error('Line content:', line.substring(0, 100) + '...');
      }
    }
  });

  // 초기화 요청 전송
  send({
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: { name: 'gemini-cli-client', version: '1.0' }
    }
  });
}

main();
