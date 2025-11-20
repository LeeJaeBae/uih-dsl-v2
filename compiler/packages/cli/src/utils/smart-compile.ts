/**
 * UIH DSL CLI - Smart Compile Utility
 *
 * Self-healing compilation with AI-powered retry loop.
 * Automatically feeds parser errors back to AI for correction.
 *
 * @module @uih-dsl/cli/utils/smart-compile
 */

import { tokenize } from "@uih-dsl/tokenizer";
import { parse } from "@uih-dsl/parser";
import { createIR } from "@uih-dsl/ir";
import type { UIHIR } from "@uih-dsl/ir";

export interface SmartCompileResult {
  /** Successfully compiled IR */
  ir: UIHIR | null;
  /** Final source code (after retries) */
  finalSource: string;
  /** All errors collected across retries */
  errors: Array<{ message: string; line?: number; column?: number }>;
  /** Number of retry attempts made */
  retryCount: number;
  /** Whether compilation succeeded */
  success: boolean;
}

export interface SmartCompileOptions {
  /**
   * Maximum number of retry attempts (default: 3)
   */
  maxRetries?: number;

  /**
   * Callback function that receives errors and returns corrected source.
   * This is where you integrate with an AI API (e.g., Claude, GPT).
   *
   * @param errors - List of compilation errors
   * @param attempt - Current retry attempt number (1-indexed)
   * @returns Promise resolving to corrected UIH source code
   */
  retryCallback: (
    errors: Array<{ message: string; line?: number; column?: number }>,
    attempt: number
  ) => Promise<string>;
}

/**
 * Compile UIH code with automatic error correction via AI.
 *
 * Workflow:
 * 1. Attempt compilation
 * 2. If errors exist, call retryCallback with error details
 * 3. AI returns corrected source
 * 4. Retry compilation
 * 5. Repeat up to maxRetries
 *
 * @param initialSource - Initial UIH source code
 * @param options - Configuration and retry callback
 * @returns Compilation result with retry metadata
 *
 * @example
 * ```typescript
 * import Anthropic from '@anthropic-ai/sdk';
 *
 * const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
 *
 * const result = await smartCompile("invalid UIH code", {
 *   maxRetries: 2,
 *   retryCallback: async (errors, attempt) => {
 *     const response = await client.messages.create({
 *       model: "claude-3-5-sonnet-20241022",
 *       messages: [{
 *         role: "user",
 *         content: `Fix these UIH errors:\n${JSON.stringify(errors, null, 2)}`
 *       }]
 *     });
 *     return response.content[0].text;
 *   }
 * });
 * ```
 */
export async function smartCompile(
  initialSource: string,
  options: SmartCompileOptions
): Promise<SmartCompileResult> {
  const maxRetries = options.maxRetries ?? 3;
  let currentSource = initialSource;
  let retryCount = 0;
  const allErrors: Array<{ message: string; line?: number; column?: number }> = [];

  while (retryCount <= maxRetries) {
    // Attempt compilation
    const compileResult = tryCompile(currentSource);

    // Track all errors
    if (compileResult.errors.length > 0) {
      allErrors.push(...compileResult.errors);
    }

    // Success!
    if (compileResult.success && compileResult.ir) {
      return {
        ir: compileResult.ir,
        finalSource: currentSource,
        errors: allErrors,
        retryCount,
        success: true,
      };
    }

    // Out of retries
    if (retryCount >= maxRetries) {
      return {
        ir: null,
        finalSource: currentSource,
        errors: allErrors,
        retryCount,
        success: false,
      };
    }

    // Call AI to fix errors
    try {
      currentSource = await options.retryCallback(compileResult.errors, retryCount + 1);
      retryCount++;
    } catch (error) {
      // AI callback failed - abort
      allErrors.push({
        message: `Retry callback failed: ${(error as Error).message}`,
      });
      return {
        ir: null,
        finalSource: currentSource,
        errors: allErrors,
        retryCount,
        success: false,
      };
    }
  }

  // Should never reach here, but TypeScript needs this
  return {
    ir: null,
    finalSource: currentSource,
    errors: allErrors,
    retryCount,
    success: false,
  };
}

/**
 * Internal helper: Attempt to compile UIH source.
 */
function tryCompile(source: string): {
  ir: UIHIR | null;
  errors: Array<{ message: string; line?: number; column?: number }>;
  success: boolean;
} {
  try {
    // Step 1: Tokenize
    const tokens = tokenize(source);

    // Step 2: Parse
    const parseResult = parse(tokens);

    if (parseResult.errors.length > 0) {
      return {
        ir: null,
        errors: parseResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        })),
        success: false,
      };
    }

    if (!parseResult.ast) {
      return {
        ir: null,
        errors: [{ message: "Failed to parse UIH code" }],
        success: false,
      };
    }

    // Step 3: Create IR
    const irResult = createIR(parseResult.ast, []);

    if (irResult.errors.length > 0) {
      return {
        ir: null,
        errors: irResult.errors.map((err) => ({
          message: err.message,
          line: err.line,
          column: err.column,
        })),
        success: false,
      };
    }

    return {
      ir: irResult,
      errors: [],
      success: true,
    };
  } catch (error) {
    return {
      ir: null,
      errors: [{ message: (error as Error).message }],
      success: false,
    };
  }
}
