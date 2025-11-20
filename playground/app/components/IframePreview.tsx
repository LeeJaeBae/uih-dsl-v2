import { useEffect, useRef } from "react";
import type { Framework } from "../types";

interface IframePreviewProps {
  code: string;
  cssVars: Record<string, string>;
  framework: Framework;
}

export function IframePreview({ code, cssVars, framework }: IframePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current || !code) return;

    const iframe = iframeRef.current;
    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) return;

    const cssVarsString = Object.entries(cssVars)
      .map(([key, value]) => `  --${key.replace(/\./g, "-")}: ${value};`)
      .join("\n");

    let html = "";

    if (framework === "react") {
      const rewrittenCode = code
        .replace(/from\s+["']@\/components\/([^"']+)["']/g, (_, name) => {
          return `from "data:text/javascript,export default function ${name}(props) { return React.createElement('div', props, props.children); }"`;
        })
        .replace(/from\s+["']react["']/g, 'from "https://esm.sh/react@18"')
        .replace(/from\s+["']react-dom\/client["']/g, 'from "https://esm.sh/react-dom@18/client"');

      html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    :root {
${cssVarsString}
    }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="root"></div>
  <script type="module">
    import React from "https://esm.sh/react@18";
    import ReactDOM from "https://esm.sh/react-dom@18/client";

    window.React = React;
    window.ReactDOM = ReactDOM;

    const code = ${JSON.stringify(rewrittenCode)};

    try {
      const transformed = Babel.transform(code, {
        presets: ['react'],
        filename: 'component.jsx'
      }).code;

      const wrappedCode = \`
        import React from "https://esm.sh/react@18";
        \${transformed}
      \`;

      const blob = new Blob([wrappedCode], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);

      import(url)
        .then((mod) => {
          const Component = mod.default;
          const root = ReactDOM.createRoot(document.getElementById("root"));
          root.render(React.createElement(Component));
        })
        .catch((err) => {
          console.error("[UIH Preview Error]", err);
          document.body.innerHTML = "<div style='padding:20px;color:red;font-family:monospace;'><strong>Runtime Error:</strong><br/>" + err.message + "</div>";
        });
    } catch (err) {
      console.error("[Babel Transform Error]", err);
      document.body.innerHTML = "<div style='padding:20px;color:red;font-family:monospace;'><strong>Transform Error:</strong><br/>" + err.message + "</div>";
    }
  </script>
</body>
</html>`;
    } else if (framework === "vue") {
      // Vue SFC에서 템플릿만 미리 추출
      const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/);
      if (!templateMatch) {
        html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>:root { ${cssVarsString} } body { margin: 0; padding: 0; }</style>
</head>
<body>
  <div style="padding:20px;color:red;font-family:monospace;">
    <strong>Vue Error:</strong><br/>No template found in Vue SFC
  </div>
</body>
</html>`;
      } else {
        const template = templateMatch[1].trim();

        html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
${cssVarsString}
    }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="importmap">
    {
      "imports": {
        "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
      }
    }
  </script>
  <script type="module">
    import { createApp } from "vue";

    const template = ${JSON.stringify(template)};

    try {
      const app = createApp({
        template: template
      });

      app.mount("#app");
    } catch (err) {
      console.error("[Vue Preview Error]", err);
      document.body.innerHTML = "<div style='padding:20px;color:red;font-family:monospace;'><strong>Vue Error:</strong><br/>" + err.message + "</div>";
    }
  </script>
</body>
</html>`;
      }
    } else if (framework === "svelte") {
      const escapedCode = code
        .replace(/\\/g, "\\\\")
        .replace(/`/g, "\\`")
        .replace(/\$/g, "\\$");

      html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
${cssVarsString}
    }
    body { margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script src="https://unpkg.com/svelte@4/compiler.js"></script>
  <script type="module">
    const svelteCode = \`${escapedCode}\`;

    try {
      const result = svelte.compile(svelteCode, {
        generate: "dom",
        hydratable: false,
        css: "injected"
      });

      const blob = new Blob([result.js.code], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);

      import(url)
        .then((mod) => {
          const Component = mod.default;
          new Component({
            target: document.getElementById("app")
          });
        })
        .catch((err) => {
          console.error("[Svelte Preview Error]", err);
          document.body.innerHTML = "<div style='padding:20px;color:red;font-family:monospace;'><strong>Svelte Error:</strong><br/>" + err.message + "</div>";
        });
    } catch (err) {
      console.error("[Svelte Compile Error]", err);
      document.body.innerHTML = "<div style='padding:20px;color:red;font-family:monospace;'><strong>Svelte Compile Error:</strong><br/>" + err.message + "</div>";
    }
  </script>
</body>
</html>`;
    }

    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
  }, [code, cssVars, framework]);

  return (
    <div className="w-full h-full relative">
      <iframe
        ref={iframeRef}
        className="w-full h-full border border-gray-300"
        sandbox="allow-scripts allow-same-origin"
        title="UIH Preview"
      />
    </div>
  );
}
