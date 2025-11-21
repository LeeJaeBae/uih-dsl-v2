export async function generateUIH(apiKey: string, jsonStructure: any): Promise<string> {
  const PROMPT = `
You are an expert UI developer specializing in "UIH DSL", a custom domain-specific language for defining UI layouts.
Your task is to convert the provided "Simplified Figma JSON" into idiomatic UIH DSL code.

### UIH DSL Rules
1. Structure: layout { RootComponent { ... } }
2. Tags: Div, Section, Header, Footer, Button, Input, H1~H6, P, Span, Img.
3. Attributes: layout attributes go into 'style' string.
   - style: "display: flex; flex-direction: column; gap: 8px; ..."
4. Props: class, id, type (for Input), src (for Img).
5. Images: If you see { "type": "IMAGE" } in fills, use Img tag with a placeholder URL (https://placehold.co/widthxheight).
6. Text: Use P for body, H1-H6 for large text. Text content goes inside the block: H1 { "Title" }
7. Semantic Naming: If a node name implies a role (e.g., "btn-primary"), infer the tag (Button) or class name.

### Input JSON
${JSON.stringify(jsonStructure)}

### Output Format
Return ONLY the raw UIH code (inside 'layout {}' block). Do not include markdown backticks.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: PROMPT }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Cleanup markdown code blocks if present
    return text.replace(/^```uih\s*/, "").replace(/^```\s*/, "").replace(/```$/, "").trim();

  } catch (error: any) {
    console.error("AI Generation Failed:", error);
    return `// Error generating code: ${error.message}`;
  }
}
