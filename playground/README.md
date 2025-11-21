# UIH Playground

The interactive playground for the UIH (User Interface for Humans) DSL.
Experience the power of AI-driven UI generation and instant compilation to React, Vue, and Svelte.

## Features

- **Live Editor:** Write UIH code and see real-time previews.
- **AI Assistant:** Generate UI code using natural language (powered by Claude or Gemini).
- **Multi-Framework Support:** Instantly compile to React, Vue, or Svelte.
- **Error Highlighting:** Get immediate feedback on syntax errors.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    pnpm install
    ```

2.  **Set up Environment Variables:**
    Create a `.env.local` file in the `playground` directory and add your API keys:
    ```env
    # Optional: For Google Gemini (Free Tier available)
    GOOGLE_API_KEY=your_google_api_key_here

    # Optional: For Anthropic Claude
    ANTHROPIC_API_KEY=your_anthropic_api_key_here
    ```

3.  **Run Development Server:**
    ```bash
    pnpm dev
    ```
    Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

This project is designed to be deployed on **Vercel**.

1.  Push your code to a GitHub repository.
2.  Import the project into Vercel.
3.  **Important:** In the Vercel project settings, add the environment variables:
    *   `GOOGLE_API_KEY` (and/or `ANTHROPIC_API_KEY`)
4.  Deploy!

## Monorepo Note

This playground is part of the UIH-v2 monorepo. It depends on local packages like `@uih-dsl/compiler`, `@uih-dsl/tokenizer`, etc. Vercel handles pnpm workspaces automatically, so no special build configuration is usually needed beyond the default.