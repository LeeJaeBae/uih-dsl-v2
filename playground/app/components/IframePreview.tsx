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
          // Mock local components
          return `from "data:text/javascript,import React from 'https://esm.sh/react@18'; export function ${name}(props) { return React.createElement('div', { ...props, 'data-uih-dummy': '${name}' }, props.children); } export default ${name};"`;
        })
        .replace(/from\s+["']react["']/g, 'from "https://esm.sh/react@18"');

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
    html, body, #root { height: 100%; margin: 0; padding: 0; }
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
      // Transform the entire code module including imports and logic
      const transformed = Babel.transform(code, {
        presets: ['react'],
        filename: 'component.jsx'
      }).code;

      const blob = new Blob([transformed], { type: "text/javascript" });
      const url = URL.createObjectURL(blob);

      import(url)
        .then((mod) => {
          const Component = mod.default;
          if (!Component) throw new Error("No default export found in generated code");
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
        
        // Extract component names used in template
        const componentNames = new Set<string>();
        const tagRegex = /<([A-Z][a-zA-Z0-9]*)/g;
        let match;
        while ((match = tagRegex.exec(template)) !== null) {
          componentNames.add(match[1]);
        }
        const componentsList = Array.from(componentNames);

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
    html, body, #app { height: 100%; margin: 0; padding: 0; }
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
    import { createApp, h } from "vue";

    const template = ${JSON.stringify(template)};
    const componentNames = ${JSON.stringify(componentsList)};

    try {
      const app = createApp({
        template: template
      });
      
      // Register dummy components for all custom tags found
      componentNames.forEach(name => {
        app.component(name, {
          inheritAttrs: false,
          template: \`<div v-bind="$attrs" :data-uih-dummy="name"><slot></slot></div>\`,
          data() { return { name }; }
        });
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
      // Downgrade custom components to divs for preview
      let processedCode = code
        .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script block completely (including lang="ts")
        .replace(/<([A-Z][a-zA-Z0-9]*)([^>]*)>/g, '<div data-uih-dummy="$1"$2>')
        .replace(/<\/([A-Z][a-zA-Z0-9]*)>/g, '</div>');
        
      const escapedCode = processedCode
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
    html, body, #app { height: 100%; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div id="app"></div>
  <script type="importmap">
    {
      "imports": {
        "svelte/internal": "https://esm.sh/svelte@4/internal",
        "svelte/internal/disclose-version": "https://esm.sh/svelte@4/internal/disclose-version",
        "svelte": "https://esm.sh/svelte@4"
      }
    }
  </script>
  <script type="module">
    import * as svelte from "https://esm.sh/svelte@4/compiler";

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
