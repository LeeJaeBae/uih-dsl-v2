import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

const systemPrompt = `You are an expert UI generator using the UIH DSL.
Your goal is to generate or modify UIH code based on user requests.

UIH DSL Specification:
1. Structure (Strict Order):
   meta { 
     title: "Page Title"
   }
   style {
     // Define design tokens here
     color.primary: "#3B82F6"
     spacing.md: "16px"
   }
   layout {
     // UI Structure
     Div {
       "Content"
     }
   }

2. Syntax Rules:
   - Properties: key: "value" (Colon is REQUIRED. Value MUST be double-quoted string)
   - Indentation: 2 spaces
   - No semicolons at end of lines
   - Comments: // for single line

3. Layout Components:
   - Use PascalCase: Div, H1, H2, P, Button, Input, Image, Card, Container, Row, Column, Stack, Spacer.
   - Text content is just a string literal inside a block.

4. Styling:
   - In 'style' block: define tokens.
   - In 'layout' block properties: use literal values or references to tokens (no special syntax, just the token name if supported, or strict values).
   - Common properties: width, height, padding, margin, backgroundColor, color, fontSize, borderRadius, display, flexDirection, gap.

Return ONLY the complete, valid UIH code. Do not include markdown backticks.`;

export async function POST(req: NextRequest) {
  try {
    const { prompt, currentCode } = await req.json();
    let generatedCode = "";

    const userMessage = currentCode
      ? `Here is the current UIH code:\n\n${currentCode}\n\nRequest: ${prompt}\n\nUpdate the code to match the request. Keep the existing structure if it makes sense, but modify/add as needed.`
      : `Generate a UI using UIH DSL for the following request: ${prompt}`;

    // Try Google Gemini first (Free tier available)
    if (process.env.GOOGLE_API_KEY) {
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash", 
        systemInstruction: systemPrompt 
      });

      const result = await model.generateContent(userMessage);
      generatedCode = result.response.text();
    
    // Fallback to Anthropic (Paid)
    } else if (process.env.ANTHROPIC_API_KEY) {
      const client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });

      const response = await client.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4096,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      });

      generatedCode = response.content[0].type === 'text' ? response.content[0].text : '';
    } else {
       return NextResponse.json(
        { error: "No API key configured. Please set GOOGLE_API_KEY (Free) or ANTHROPIC_API_KEY." },
        { status: 500 }
      );
    }

    // Clean up markdown if the model adds it
    const cleanedCode = generatedCode
      .trim()
      .replace(/^```[\w]*\n/, "")
      .replace(/\n```$/, "")
      .trim();

    return NextResponse.json({ code: cleanedCode });

  } catch (error: any) {
    console.error("AI Generation Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate code" },
      { status: 500 }
    );
  }
}